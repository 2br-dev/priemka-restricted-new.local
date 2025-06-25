import { EducationBase, ICardData, IData, IEducationForm, IEducationFreeBase, IEducationLevel, IEducationPaidBase, IFilterParams, IMinScore, IPreparedData, IRequirement, ISection } from './card_interfaces';
import template from './template';

class Calculator{

	data:IData;
	container:HTMLElement;
	filterParams:IFilterParams;
	selectedCard:ICardData;
	filteredData:IData;
	renderComplete?:()=>void

	/**
	 * 
	 * @param container Контейнер
	 * @param dataURL URL данных
	 * @param renderComplete Callback по завершению
	 */
	constructor(container:HTMLElement | string, dataURL:string, renderComplete = () => {}){

		this.renderComplete = renderComplete;

		this.filterParams = {
			QuickSearch: "",
			Level: "Бакалавриат/специалитет",
			Base: EducationBase.FREE,
			Form: "Очная",
			MinScore: null,
			Requirements: []
		}

		if(typeof(container) === "string"){
			this.container = <HTMLElement>document.querySelector(container);
		}else{
			this.container = container;
		}

		fetch(dataURL)
			.then(response => response.json())
			.then(data => {
				this.data = data;
				this.render()
			})
			// .catch(err => console.error(err))
	}

	// Рендер результата
	render(){
		this.filter();
		let preparedData = this.prepareData(this.filteredData.Elements);
		let mustache = require('mustache');

		let output = mustache.render(template, preparedData);

		this.container.innerHTML = output;
		
		this.renderComplete?.();
	}

	// Сброс параметров
	reset(){
		this.filterParams = {
			QuickSearch: "",
			Level: "Бакалавриат/специалитет",
			Base: EducationBase.FREE,
			Form: "Очная",
			MinScore: null,
			Requirements: []
		}
	}

	// Фильтрация данных
	filter(){

		const _this = this;
		let outputArray = _this.data.Elements;
		
		// Уровень образования
		outputArray = outputArray.filter((el:ICardData) => {
		
			if(el.Education_levels){

				let Level = el.Education_levels.filter((Level:IEducationLevel) => {
					if(_this.filterParams.Level == "Бакалавриат/специалитет"){
						return Level.Name == "Бакалавриат" || Level.Name == "Специалитет";
					}else{
						return Level.Name == _this.filterParams.Level
					}
				})[0];

				el.SelectedLevel = Level;

				return Level !== undefined;
			}
		})

		// Форма образования
		outputArray = outputArray.filter((card:ICardData) => {
			if(card.SelectedLevel){
				let Form:IEducationForm = card.SelectedLevel.Forms.filter((f:IEducationForm) => {
					return f.Name === _this.filterParams.Form
				})[0]

				card.SelectedForm = Form;

				return Form !== undefined
			}

		})

		// Минимальный балл
		outputArray.map((card:ICardData) => {
			if(card.SelectedForm){
				let Base:IEducationFreeBase | IEducationPaidBase = _this.filterParams.Base === EducationBase.FREE ? card.SelectedForm.Vacations.Free : card.SelectedForm.Vacations.Paid;
				card.SelectedBase = Base;
				card.SelectedBase.Name = _this.filterParams.Base === EducationBase.FREE ? "Бюджет" : "Договор";
			}
		})

		// Финансовая база
		outputArray = outputArray.filter((card:ICardData) => {
			if(card.SelectedBase){
				let Base:IEducationFreeBase | IEducationPaidBase = _this.filterParams.Base === EducationBase.PAID ? card.SelectedForm?.Vacations.Paid : card.SelectedForm?.Vacations.Free;
				card.SelectedBase = Base;
				let BaseTotal = typeof(Base.Total) === "string" ? parseInt(Base.Total) : Base.Total;
				return BaseTotal > 0;
			}
		});

		// Быстрый поиск
		outputArray = outputArray.filter((el:ICardData) => {

			let needleS = (el.Speciality || "").toLowerCase();
			let needleF = el.Faculty.Name.toLowerCase();
			let needleP = (el.Profile || "").toLowerCase();
			let search = _this.filterParams.QuickSearch.toLowerCase().trim();

			let retVal = needleS.indexOf(search) >= 0  || needleF.indexOf(search) >= 0 || needleP.indexOf(search) >= 0 ;

			return retVal === true;
		})

		// Требования
		if(_this.filterParams.Level == "Бакалавриат" || _this.filterParams.Level == 'Специалитет' || _this.filterParams.Level=="Бакалавриат/специалитет"){

			if(_this.filterParams.Requirements.length >= 3){

				// Первый проход (обязательные предметы)
				let Necessary = outputArray.filter((el:ICardData) => {
					
					let necArray = el.Requirements?.filter((r:IRequirement) => {
						return r.Classname === 'required';
					})
		
					let necStrArray = necArray?.map((r:IRequirement) => {
						return r.Name
					});
		
					let necIntersect = _this.filterParams.Requirements.filter(val => necStrArray?.includes(val));
					return necIntersect.length >= 2
		
				});
		
				// Второй проход (необязательные предметы)
				let Optional = Necessary.filter((el:ICardData) => {
					let optArray = el.Requirements?.filter((r:IRequirement) => {
						return r.Classname === 'optional';
					});
		
					let optStrArray = optArray?.map((r:IRequirement) => {
						return r.Name;
					})
		
					let optIntersect = _this.filterParams.Requirements.filter(val => optStrArray?.includes(val));
					return optIntersect.length >= 1;
				});
		
				outputArray = Optional;
			}

		}

		let output:IData = {
			Elements: outputArray
		}

		_this.filteredData = output;
	}

	// Получение минимального балла
	getScore(id:number, year?: number):number{
		let cards = this.filteredData.Elements.filter((c:ICardData) => {
			return c.Id === id;
		})

		if(cards.length){
			let card = cards[0];
			
			let score:IMinScore;

			if(year !== null && year !== undefined){
				score = card.SelectedBase?.MinScore.filter((val:IMinScore) => {
					return val.Year === year;
				})[0];
			}else{
				if(card.SelectedBase?.MinScore){
					score = card.SelectedBase?.MinScore[0];
				}else{
					score = null;
					console.error(card.Id);
				}
			}

			return score.Score
		}
	}

	// Сортировка секций
	sortSections(Sections: ISection[]):void{
		Sections.sort((a, b) => {
			if (a.Name < b.Name) return -1;
			if (a.Name > b.Name) return 1;
			return 0;
		});

		Sections.forEach((s:ISection) => {
			s.SectionContent.sort((a, b) => {
				if(a.Order > b.Order) return 1;
				if(a.Order < b.Order) return -1;
				return 0;
			})
		})
	}

	// Вставка в указанный индекс массива нового элемента
	InsertArray(arr:Array<ICardData>, index:number, newElement:ICardData):ICardData[]{
		let newArray =  [
			...arr.slice(0,index),
			newElement,
			...arr.slice(index)
		]
		return newArray;
	}

	// Группировка данных перед передачей в шаблонизатор
	prepareData(Elements:ICardData[]):IPreparedData{

		if(!Elements) return { Sections: [] }

		let preparedData = { 
			Sections:new Array<ISection>()
		};

		const _this = this;

		Elements.forEach((card:ICardData) => {

			card.Necessary = card.Requirements?.filter((r:IRequirement) => r.Classname == 'required');
			card.Optional = card.Requirements?.filter((r:IRequirement) => r.Classname == 'optional');

			let OverflowClass = "";
			let order:number = 0;
			if(_this.filterParams.MinScore !== null){
				if(card.SelectedBase?.MinScore.length){
					OverflowClass = card.SelectedBase?.MinScore[0].Score > _this.filterParams.MinScore ? "overflow" : "";
					order = OverflowClass === "" ? 0 : 1;
				}
			}

			card.OverflowClass = OverflowClass;
			card.Order = order;

			let sectionNeedle = preparedData.Sections.filter((s:ISection) => {
				return s.Name == card.Faculty.Name;
			})

			let section:ISection;
			let Available:boolean;

			if(sectionNeedle.length === 0){
				section = {
					Name: card.Faculty.Name,
					SectionContent: [card],
					Count: {
						Available: 0,
						Total: 0
					},
					Indicator: ""
				}
				preparedData.Sections.push(section);
			}else{

				section = sectionNeedle[0];
				
				section.SectionContent.push(card);
				
				section.Count = {
					Available: 0,
					Total: 0
				};

				section.Indicator = "";
			}
		})

		this.sortSections(preparedData.Sections);

		preparedData.Sections.forEach((s:ISection) => {
			let Total = s.SectionContent.length;
			let Available:number;
			if(this.filterParams.MinScore === 0 || this.filterParams.MinScore === null){
				Available = Total;
			}else{
				Available = s.SectionContent.filter((c:ICardData) => {
					if(c.SelectedBase?.MinScore.length){
						return c.SelectedBase?.MinScore[0].Score <= _this.filterParams.MinScore
					}
				}).length
			}
			let Indicator = "";

			switch(true){
				case Available === 0: Indicator = "i-red"; break;
				case Available > 0 && Available < Total: Indicator = "i-orange"; break;
				case Available === Total: Indicator = "i-green"; break;
			}

			s.Indicator = Indicator;
			s.Count = {
				Available: Available,
				Total: Total
			};


		})

		if(preparedData.Sections.length === 1 && preparedData.Sections[0].Name === "") preparedData = {Sections: []};

		return preparedData;
	}
}

export default Calculator;
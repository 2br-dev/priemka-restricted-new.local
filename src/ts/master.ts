import Calculator from "./lib/calculator";
import { EducationBase, ICardData, IData } from "./lib/card_interfaces";
import * as M from 'materialize-css';
import CardModal from "./lib/card_modal";
import * as Charts from 'echarts';
import Tooltip from "./lib/tooltip";


let calculator:Calculator;

let rowsVisible:boolean = false;

// Инициализация
$(() => {
	calculator = new Calculator('#output', '/lpk-2025-restricted/data/data.json', () => {
		let t = new Tooltip('.tooltipped');
	});

	$('body').on('input', '[name="search"]', quickSearch); 			// Быстрый поиск
	$('body').on('change', '[name="level"]', selectLevel); 			// Уровень образования
	$('body').on('change', '[name="form"]', switchForm);			// Форма образования
	$('body').on('change', '[name="base"]', switchBase);			// Фин. база
	$('body').on('change', '[name="score"]', collectFilters);		// Минимальный балл
	$('body').on('change', '[name="result[]"]', collectFilters);	// Результаты ЕГЭ
	$('body').on('click', '#submit', filter);						// Запуск фильтров
	$('body').on('click', '#reset', reset);							// Сброс фильтров
	$('body').on('click', '.faculty-header', toggleFaculty);		// Отображение содержимого факультета
	$('body').on('click', '[data-remark]', openRemark);				// Открытие пояснения к стоимости
	$('body').on('click', '.remark-close-trigger', closeRemark);	// Закрытие пояснения к стоимости по клику на X
	$('body').on('click', '#toggle-rows', toggleRows);				// Переключение видимости строк
	$('body').on('click', '#scroll-top', scrollTop);				// Переключение видимости строк
	$(window).on('resize', updateCharts);							// Обновление ширины графиков

	window.addEventListener('scroll', toggleUpButton)				// Отображение кнопки (прокрутить до верха)

	$('body').on('click', '.spec-card', openModal);

});

// Обновление ширины графиков
function updateCharts(){
	document.querySelectorAll('.graph-wrapper').forEach((element:Element) => {
		let el = element as HTMLElement;
		let chart = (el as any).chart;

		if(chart !== null && chart !== undefined){
			chart.resize();
		}
	});
}

// Чничтожение графиков
function destroyCharts(container:HTMLDivElement){
	container.querySelectorAll('.graph-wrapper').forEach((element:Element) => {
		let el = element as HTMLElement;
		let chart = (el as any).chart;
		if(chart !== null && chart !== undefined){
			chart.setOption({});
			chart = null;
			(el as any).chart = null;
		}
	});
}

// Построение графиков
function buildCharts(container:HTMLDivElement) {
	
	container.querySelectorAll('.graph-wrapper').forEach((element:Element) => {
		
		// Читаем данные из атрибутов
		let el = element as HTMLDivElement;
		let yearsString = el.dataset.years;
		if(yearsString.length > 1){
			yearsString = yearsString?.substring(0, yearsString.length - 1)
		}
		let scoresString = el.dataset.scores;
		if(scoresString.length > 1){
			scoresString = scoresString?.substring(0, scoresString.length - 1)
		}

		let years = yearsString?.split(",").reverse();
		let scores = [];

		// Преобразуем в массивы
		if(scoresString !== "")scores = scoresString?.split(",").reverse();

		if(scores.length == 0) scores = [0,0,0]
		
		// Если массивы не пусты, генерируем графики
		if(scores.length > 1 && years.length > 1){
			let chart = Charts.init(el);

			let options = {
				animationDuration: 280,
				title: {
					text: 'Минимальный проходной балл в динамике',
					left: 16,
					textStyle: {
						fontWeight: 400,
						fontSize: 16
					}
				},
				grid: {
					left: '40px',
					right: '40px',
					top: '60px',
					bottom: '40px',
				},
				tooltip: {
					trigger: 'item'
				},
				xAxis: {
				  type: 'category',
				  boundaryGap: false,
				  data: years,
				  splitLine: {
					show: false
				  },
				},
				yAxis: {
				  type: 'value',
				  splitLine: {
					show: false
				  },
				  show: false
				  
				},
				series: [
				  {
					data: scores,
					type: 'line',
					smooth: true,
					lineStyle: {
					  width: 2,
					  color: '#1FAD96'
					},
					symbol: 'circle',
					symbolSize: 10,
					itemStyle: {
					  color: '#1FAD96'
					},
					label: {
						show: true,
						position: 'top',
					},
					areaStyle: {
					  color: new Charts.graphic.LinearGradient(0, 0, 0, 1, [
						{
						  offset: 0,
						  color: 'rgba(31,173,150,0.2)'
						},
						{
						  offset: 1,
						  color: 'rgba(31,173,50,0)'
						}
					  ])
					},
				  }
				]
			}

			options && chart.setOption(options);

			(el as any).chart = chart;
		}
	})
}

// Промотка наверх
function scrollTop() {
	document.documentElement.scrollTop = 0;
}

// Отображение кнопки (прокрутить до верха)
function toggleUpButton(){
	let scrollTop = (document.documentElement as HTMLElement).scrollTop;
	if(scrollTop > 20){
		$('#scroll-top').addClass('visible');
	}else{
		$('#scroll-top').removeClass('visible');
	}
}

// Переключение открытости строк
function toggleRows(e?:JQuery.ClickEvent){
	e?.preventDefault();
	rowsVisible = !rowsVisible;
	let buttonText = rowsVisible ? 'Свернуть все' : 'Развернуть все';
	$('#toggle-rows').text(buttonText);

	$('.faculty-header').each((index:number, el:HTMLElement) => {
		let $el = $(el);
		if(rowsVisible){
			$el.addClass('active');
			let $cardsWrapper = $el.next();

			$cardsWrapper.slideDown('fast', null, () => {
				buildCharts($cardsWrapper[0] as HTMLDivElement)
			});
		}else{
			$el.removeClass('active');
			let $cardsWrapper = $el.next();

			$cardsWrapper.slideUp('fast', null, () => {
				destroyCharts($cardsWrapper[0] as HTMLDivElement)
			});
		}
	});
}

// Модальное окно с описанием
function openModal(e:JQuery.ClickEvent){

	let path = e.originalEvent?.composedPath();
	let cardEl = e.currentTarget as HTMLElement;

	let links = path?.filter((e:EventTarget) => {
		return e instanceof HTMLAnchorElement;
	})

	if(!links?.length){

		let calculatorData:IData = calculator?.filteredData;
		let cardId = parseInt(cardEl.dataset['id'] || "");
		cardEl.classList.add('waves-effect');
	
		if(!isNaN(cardId)){
			let cards = calculatorData.Elements.filter((c:ICardData) => {
				return c.Id === cardId;
			});
	
			if(cards.length){
				let card = cards[0];
				let modal = new CardModal(card);
			}
		}
	}else{
		cardEl.classList.remove('waves-effect');
	}
}

// Закрытие пояснений к цене
function closeRemark(e:JQuery.ClickEvent){
	e.preventDefault();
	let remark  = $(e.currentTarget).parents('.remark-popup');
	remark.removeClass('open');

	setTimeout(() => {
		remark.remove();
	}, 500);
}

// Открытие пояснений к цене
function openRemark(e:JQuery.ClickEvent){

	let remark = e.currentTarget.dataset['remark'];

	// Проверяем наличие уже открытого popup'а
	if($('.remark-popup').length > 0){
		return null;
	}

	if(remark && remark != ""){

		// Формирование DOM
		let remarkPopup = document.createElement('div');
		remarkPopup.className = 'remark-popup';
		let remarkCloseTrigger = document.createElement('a');
		remarkCloseTrigger.className = 'bx bx-x remark-close-trigger';
		remarkCloseTrigger.setAttribute('href', 'javascript:void(0)');
		let remarkContent = document.createElement('div');
		remarkContent.className = 'remark-content';
		remarkContent.innerHTML = remark;
		remarkPopup.append(remarkContent);
		remarkPopup.append(remarkCloseTrigger);
		let parent = e.currentTarget.parentElement;


		// Открытие
		parent.append(remarkPopup);
		setTimeout(() => {
			remarkPopup.classList.add('open');
		})
	}
}

// Переключение отображения факультета
function toggleFaculty(e:JQuery.ClickEvent){
	let fheader = $(e.currentTarget);
	let sectionCards = fheader.next();

	let already = sectionCards.is(':visible');
	let classname = already ? "faculty-header" : "faculty-header active";
	fheader[0].className = classname;

	if(!already){
		sectionCards.slideDown('fast', null, () => {
			buildCharts(sectionCards[0]);
		});
	}else{
		sectionCards.slideUp('fast', null, () => {
			destroyCharts(sectionCards[0])
		});
	}

	// Если хоть одна строка развёрнута
	if($('.faculty-header.active').length > 0){
		rowsVisible = true;
		$('#toggle-rows').text('Свернуть все');
	}

	// Если все строки свёрнуты вручную
	if($('.faculty-header:not(.active)').length === $('.faculty-header').length){
		rowsVisible = false;
		$('#toggle-rows').text('Развернуть все');
	}
}

// Запуск фильтрации
function filter(){
	if(calculator.filterParams.Requirements.length > 0 && calculator.filterParams.Requirements.length < 3){
		M.toast({html: "Пожалуйста, выберите не менее трёх предметов!"})
		return null;
	}
	calculator?.render();
	rowsVisible = false;

	if(!$('.faculty-header').length){
		$('#toggle-rows').addClass('disabled');
	}else{
		$('#toggle-rows').removeClass('disabled');
	}

	$('.available').removeClass('hide');
}

// Сброс фильтров
function reset(){
	calculator.reset();
	(document.querySelector('#filters') as HTMLFormElement).reset();
	(document.querySelector('#top-form') as HTMLFormElement).reset();
	$('.tag, .input-field').removeClass('disabled');
	$('#output').scrollTop(0);
	$('#toggle-rows').text('Развернуть все');
	rowsVisible = false;
	calculator?.render();

	$('.available').addClass('hide');
}

// Сбор данных фильтров
function collectFilters(){

	if(calculator){

		// Минимальный балл
		calculator.filterParams.MinScore = parseInt((document.querySelector('[name="score"]') as HTMLInputElement).value) || null

		// Результаты ЕГЭ
		calculator.filterParams.Requirements = [];
		document.querySelectorAll('[name="result[]"]:checked').forEach((el:EventTarget) => {
			calculator.filterParams.Requirements.push((el as HTMLInputElement).value);
		})
	}

}

// Построение графиков в открытых факультетах
function buildVisibleCharts(){
	document.querySelectorAll('.faculty-header.active').forEach((element:Element) => {
		let el = element as HTMLElement;
		let cardsWrapper = el.nextElementSibling as HTMLDivElement;

		if(cardsWrapper){
			buildCharts(cardsWrapper);
		}
	})
}

// База образования
function switchBase(){

	let rows:boolean[] = SaveRowsVisibility();
	calculator.filterParams.Base = (document.querySelector('[name="base"]:checked') as HTMLInputElement).value === 'free' ? EducationBase.FREE : EducationBase.PAID;
	calculator.render();
	RestoreRowsVisibility(rows);
	buildVisibleCharts();
	toggleRowsButton();

	if(calculator.filterParams.MinScore !== null && calculator.filterParams.MinScore > 0){
		$('.available').removeClass('hide');
	}

}

// Форма образования
function switchForm(){
	if(calculator){
		let rows = SaveRowsVisibility();
		let form = (document.querySelector('[name="form"]:checked') as HTMLInputElement).value;
		calculator.filterParams.Form = form;
		calculator.render();
		RestoreRowsVisibility(rows);
		buildVisibleCharts();
		toggleRowsButton();

		if(calculator.filterParams.MinScore !== null && calculator.filterParams.MinScore > 0){
			$('.available').removeClass('hide');
		}
	}
}

// Установка доступности кнопки "Развернуть все"
function toggleRowsButton(){
	if(!$('.faculty-header').length){
		$('#toggle-rows').addClass('disabled');
	}else{
		$('#toggle-rows').removeClass('disabled');
	}
}

// Быстрый поиск
function quickSearch(){
	if(calculator){
		calculator.filterParams.QuickSearch = (document.querySelector('[name="search"]') as HTMLInputElement).value;
		calculator.render();
		toggleRowsButton();
	}
}

// Уровень образования
function selectLevel(){
	if(calculator){
		let level = (document.querySelector('[name="level"]:checked') as HTMLInputElement).value;
		
		(document.querySelector('#filters') as HTMLFormElement).reset();
		calculator.reset();
		calculator.filterParams.Level = level;

		rowsVisible = false;
		$('#toggle-rows').text('Развернуть все');

		if(level !== "Бакалавриат/специалитет"){
			$('[name="result[]"]').prop('checked', false);
			$('.tag, .input-field').addClass('disabled');
			$('[name="score"]').val('');

		}else{
			$('.tag, .input-field').removeClass('disabled');
		}

		calculator.container.setAttribute('data-level', level);
		calculator.render();
		toggleRowsButton();
	}
}

// Сохранение видимости строк
function SaveRowsVisibility():boolean[]{
	let rows:Array<boolean> = []
	document.querySelectorAll('.faculty-header').forEach((el) => {
		rows.push(el.classList.contains('active') ? true : false);
	})
	return rows;
}

// Восстановление видимости сток
function RestoreRowsVisibility(rows:boolean[]){
	rows.forEach((visible:boolean, index:number) => {
		if(visible){
			let el = $('.faculty-header')[index];
			$(el).addClass('active').next().show()			
		}
	})
}
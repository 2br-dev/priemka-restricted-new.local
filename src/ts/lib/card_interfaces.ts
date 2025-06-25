export enum EducationBase{
	FREE = 'Free',
	PAID = 'Paid'
}

export interface IFilterParams{
	QuickSearch:string,
	Level:string,
	Base: EducationBase
	Form: string,
	Requirements: string[],
	MinScore:number | null
}

export interface IMinScore{
	year: number,
	score: number
}

export interface IEducationFreeBase{
	Name: string,
	Total: number,
	Main?: number,
	Target?: number,
	Particular?: number,
	Special?: number,
	MinScore: IMinScore[]
}

export interface IEducationPaidBase{
	Name: string,
	Total: number,
	Main?: number,
	Foreign?: number,
	MinScore: IMinScore[]
}

export interface IEducationForm{
	Name: string,
	Duration: number,
	Price: number,
	Remark:string,
	Vacations: {
		Free: IEducationFreeBase,
		Paid: IEducationPaidBase
	}
}

export interface IRequirement{
	Name:string,
	Min: number,
	Classname: string
}

export interface IEducationLevel{
	Name: string,
	Code: string,
	Details?: {
		Image?: string,
		About?: string
	},
	Forms: Array<IEducationForm>
}

export interface IFormSwitcher{
	Name: string,
	Classname: string
}

export interface ICardData{
	Id?: number,
	Order?: number,
	OverflowClass?: string,
	Faculty: {
		Name: string,
		About: string
	}
	Profile?: string,
	Speciality?: string,
	Education_levels?: Array<IEducationLevel>,
	Requirements?: Array<IRequirement>,
	Necessary?:Array<IRequirement>,
	Optional?:Array<IRequirement>,
	Price?: number,
	SelectedLevel?:IEducationLevel,
	SelectedForm?:IEducationForm,
	SelectedBase?:IEducationFreeBase | IEducationPaidBase,
	Switcher?: IFormSwitcher[],
	ExternalLink?: string,
	Extra?: {
		Head: {
			Last_name: string,
			First_name: string,
			Middle_name: string,
			Rank: string,
			Regalia: string,
			Phone: string
		},
		Networks: {
			Icon: string,
			Link: string
		},
		Phones: {
			Number: string,
			Link: string
		}
	}
}

export interface IData{
	Elements:Array<ICardData>
}

export interface ISection{
	Name: string,
	SectionContent: ICardData[];
	Count: {
		Available: number,
		Total: number,
	},
	Indicator: string
}

export interface IPreparedData{
	Sections: ISection[];
}

export interface IURLCardData{
	Id:number,
	Form:string,
	Level:string
}
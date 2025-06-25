let LastYear = (new Date().getFullYear() - 1).toString().substring(2,4);

let template = `
{{#Sections}}
<div class="faculty-header" data-faculty="{{Name}}">
	<div class="folder-arrow"></div>
	<h2 class="no-margin">{{Name}} <span class="indicator {{Indicator}}"><span class="Available hide">{{Count.Available}} / </span>{{Count.Total}}</span></h2>
</div>
<div class="section-wrapper">
	<div class="section-content">
	{{#SectionContent}}
	<div class="spec-card-wrapper">
		<div class="spec-card waves-effect hoverable z-depth-1 {{OverflowClass}}" data-id="{{Id}}" data-faculty="{{Faculty.Name}}" data-order="{{Order}}" >
			<div class="card-header">
				<div class="speciality">
					<h3 class="tooltipped" data-tooltip="{{Speciality}}" data-position="top">{{Speciality}}</h3>
					<p>{{SelectedLevel.Code}} {{Profile}}</p>
				</div>
				{{#SelectedBase.MinScore.0.Score}}
				<div class="min-score">
					<i>Мин. балл '${LastYear}</i>
					<span>{{SelectedBase.MinScore.0.Score}}</span>
				</div>
				{{/SelectedBase.MinScore.0.Score}}
				{{^SelectedBase.MinScore.0.Score}}
				<div class="min-score">
					<i>Мин. балл '${LastYear}</i>
					<span class="tooltipped" data-tooltip="Нет данных" data-position="top">Н/Д</span>
				</div>
				{{/SelectedBase.MinScore.0.Score}}
			</div>
			<div class="selected-data">{{SelectedForm.Name}} форма // {{SelectedBase.Name}}</div>
			<div class="details">
				<div class="numbers">
					<div class="number-block">
						<div class="title">Форма обучения</div>
						<div class="number">
							{{SelectedForm.Name}}
						</div>
					</div>
					<div class="number-block">
						<div class="title">Бюджетные места</div>
						<div class="number">
							{{SelectedForm.Vacations.Free.Total}}
						</div>
					</div>
					<div class="number-block">
						<div class="title">Места по договору</div>
						<div class="number">
							{{SelectedForm.Vacations.Paid.Total}}
						</div>
					</div>
					<div class="number-block">
						<div class="title">Продолжительность</div>
						<div class="number">
							{{SelectedForm.Duration}}
						</div>
					</div>
					<div class="number-block">
						<div class="title">Стоимость обучения</div>
						<div class="number">
							{{#SelectedForm.Remark}}
							<a href="javascript:void(0)" data-Remark="{{SelectedForm.Remark}}">
								{{SelectedForm.Price}} ₽/год
								<i class="bx bxs-info-circle"></i>
							</a>
							{{/SelectedForm.Remark}}
							{{^SelectedForm.Remark}}
							{{SelectedForm.Price}} ₽/год
							{{/SelectedForm.Remark}}
						</div>
					</div>
				</div>
				<div class="requirements">
					<div class="requirement-header">Обязательные предметы</div>
					{{#Necessary}}
					<div class="requirement {{Classname}}">{{Name}} <span class="min"> {{Min}}</span></div>
					{{/Necessary}}
					<div class="requirement-header">Дополнительные предметы</div>
					{{#Optional}}
					<div class="requirement {{Classname}}">{{Name}} <span class="min"> {{Min}}</span></div>
					{{/Optional}}
				</div>
			</div>
			{{#note}}
				<div class="note">
				{{.}}
				</div>
			{{/note}}
			<div class="graph-wrapper" data-years="{{#SelectedBase.MinScore}}{{Year}},{{/SelectedBase.MinScore}}" data-scores="{{#SelectedBase.MinScore}}{{Score}},{{/SelectedBase.MinScore}}">

			</div>
		</div>
	</div>
	{{/SectionContent}}
	</div>
</div>
{{/Sections}}
{{^Sections}}
<div class="nulltext">
	<img src="/lpk-2025-restricted/img/no-result.png" />
</div>
{{/Sections}}
`

export default template;
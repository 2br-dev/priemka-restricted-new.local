let dataTpl = `
<div class="numbers" id="free">
	<h4 class="numbers-header">Бюджетные места</h4>
	<table>
		<tbody>
			{{#SelectedForm.Vacations.Free.Total}}
			<tr><td class="key">Всего мест</td><td class="value">
				{{SelectedForm.Vacations.Free.Total}}
			</td></tr>
			{{/SelectedForm.Vacations.Free.Total}}
			{{^SelectedForm.Vacations.Free.Total}}
			<tr><td class="key">Всего мест</td><td class="value">
				0
			</td></tr>
			{{/SelectedForm.Vacations.Free.Total}}
			{{#SelectedForm.Vacations.Free.Main}}
			<tr><td class="key">Основные места</td><td class="value">
				{{SelectedForm.Vacations.Free.Main}}
			</td></tr>
			{{/SelectedForm.Vacations.Free.Main}}
			{{#SelectedForm.Vacations.Free.Target}}
			<tr><td class="key">Целевая квота</td><td class="value">
				{{SelectedForm.Vacations.Free.Target}}
			</td></tr>
			{{/SelectedForm.Vacations.Free.Target}}
			{{#SelectedForm.Vacations.Free.Particluar}}
			<tr><td class="key">Отдельная квота</td><td class="value">
				{{SelectedForm.Vacations.Free.Particluar}}
			</td></tr>
			{{/SelectedForm.Vacations.Free.Particluar}}
			{{#SelectedForm.Vacations.Free.Special}}
			<tr><td class="key">Специальная квота</td><td class="value">
				{{SelectedForm.Vacations.Free.Special}}
			</td></tr>
			{{/SelectedForm.Vacations.Free.Special}}
		</tbody>
	</table>
</div>
<div class="numbers" id="paid">
	<h4 class="numbers-header">Обучение по договору</h4>
	<table>
		<tbody>
			{{#SelectedForm.Vacations.Paid.Total}}
			<tr><td class="key">Всего мест</td><td class="value">
				{{SelectedForm.Vacations.Paid.Total}}
			</td></tr>
			{{/SelectedForm.Vacations.Paid.Total}}
			{{^SelectedForm.Vacations.Paid.Total}}
			<tr><td class="key">Всего мест</td><td class="value">
				0
			</td></tr>
			{{/SelectedForm.Vacations.Paid.Total}}
			{{#SelectedForm.Vacations.Paid.Main}}
			<tr><td class="key">Основные</td><td class="value">
				{{SelectedForm.Vacations.Paid.Main}}
			</td></tr>
			{{/SelectedForm.Vacations.Paid.Main}}
			{{#SelectedForm.Vacations.Paid.Foreign}}
			<tr><td class="key">Иностранные</td><td class="value">
				{{SelectedForm.Vacations.Paid.Foreign}}
			</td></tr>
			{{/SelectedForm.Vacations.Paid.Foreign}}
			{{#SelectedForm.Price}}
			<tr><td class="key">Стоимость</td><td class="value">
				{{SelectedForm.Price}} ₽/год
			</td></tr>
			{{/SelectedForm.Price}}
		</tbody>
	</table>
</div>
<div class="numbers" id="contacts">
	<h4 class="numbers-header">Дополнительно</h4>
	<table>
		<tbody>
			<tr><td class="key">Факультет</td><td class="value">{{Faculty.Name}}</td></tr>
			<tr><td class="key">Декан</td><td class="value">{{Extra.Head.Last_name}} {{Extra.Head.First_name}} {{Extra.Head.Middle_name}}</td></tr>
			{{#Extra.Phones}}
			<tr>
				<td class="key">Телефон</td>
				<td class="value"><a href="tel:{{Link}}">{{Number}}</a></td>
			</tr>
			{{/Extra.Phones}}
		</tbody>
	</table>
</div>
<div class="numbers" id="results">
	<h4 class="numbers-header">ЕГЭ</h4>
	<table>
		<thead>
			<th colspan="2" class="subheader">Обязательные предметы</th>
		</thead>
		<tbody>
			{{#Necessary}}
			<tr><td class="key">{{Name}}</td><td class="value {{Classname}}">{{Min}}</td></tr>
			{{/Necessary}}
		</tbody>
	</table>
	<table>
		<thead>
			<th colspan="2" class="subheader">Дополнительные предметы</th>
		</thead>
		<tbody>
			{{#Optional}}
			<tr><td class="key">{{Name}}</td><td class="value {{Classname}}">{{min}}</td></tr>
			{{/Optional}}
		</tbody>
	</table>
</div>
`

export default dataTpl;
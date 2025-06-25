let modalTpl = `
<div class="modal-wrapper" data-level="{{SelectedLevel.Name}}">
	<div class="modal">
		<div class="modal-header">
			<div class="title-wrapper">
				<h3>{{Speciality}}</h3>
				<p>{{SelectedLevel.Code}} {{Profile}}</p>
			</div>
			<div class="form-switch">
				<ul class="segmented-control">
					{{#SelectedLevel.Forms}}
					<li>
						<input type="radio" name="modal-form" id="{{Name}}" value="{{Name}}" />
						<label for="{{Name}}">{{Name}}</label>
					</li>
					{{/SelectedLevel.Forms}}
				</ul>
			</div>
		</div>
		<div class="modal-content" id="numbers-wrapper">
			<div class="numbers" id="Free">
				<h4 class="numbers-Header">Бюджетные места</h4>
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
						{{#SelectedForm.Vacations.Free.Particlular}}
						<tr><td class="key">Отдельная квота</td><td class="value">
							{{SelectedForm.Vacations.Free.Particlular}}
						</td></tr>
						{{/SelectedForm.Vacations.Free.Particlular}}
						{{#SelectedForm.Vacations.Free.Special}}
						<tr><td class="key">Специальная квота</td><td class="value">
							{{SelectedForm.Vacations.Free.Special}}
						</td></tr>
						{{/SelectedForm.Vacations.Free.Special}}
					</tbody>
				</table>
			</div>
			<div class="numbers" id="Paid">
				<h4 class="numbers-Header">Обучение по договору</h4>
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
				<h4 class="numbers-Header">Дополнительно</h4>
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
				<h4 class="numbers-Header">ЕГЭ</h4>
				<table>
					<tHead>
						<th colspan="2" class="subHeader">Обязательные предметы</th>
					</tHead>
					<tbody>
						{{#Necessary}}
						<tr><td class="key">{{Name}}</td><td class="value {{Classname}}">{{Min}}</td></tr>
						{{/Necessary}}
					</tbody>
				</table>
				<table>
					<tHead>
						<th colspan="2" class="subHeader">Дополнительные предметы</th>
					</tHead>
					<tbody>
						{{#Optional}}
						<tr><td class="key">{{Name}}</td><td class="value {{Classname}}">{{Min}}</td></tr>
						{{/Optional}}
					</tbody>
				</table>
			</div>
		</div>
		{{#Note}}
		<div class="note"><p>{{Note}}</p></div>
		{{/Note}}
		<div class="modal-footer">
			<a href="#!" class="bttn" id="close-modal">Закрыть</a>
		</div>
	</div>
</div>
`

export default modalTpl;
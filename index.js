let data_manager = {
	"lunes": [],
	"martes": [],
	"miercoles": [],
	"jueves": [],
	"viernes": [],
	"sabado": [],
	"domingo": []
};

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
})

function saveHorary(){
	let ultimate_server = localStorage.getItem('data_horary');
	localStorage.setItem('data_horary', JSON.stringify(data_manager))
	Toast.fire({
	  icon: 'success',
	  title: 'Horario Guardado Satisfactoriamente'
	})
	setTimeout(() => {
		location.reload()
	}, 2000)
}

function delHorary(id, day){
	let findID = document.querySelector(`#id-${id}`);
	if(!findID){
		Swal.fire({
		  icon: 'error',
		  title: 'Error en el horario',
		  text: 'Parece que hubo un error con este horario.'
		})
	}else {
		let dayfind = data_manager[`${day}`].findIndex((ch) => ch.id == id);
		if(dayfind >= 0){
			findID.remove();
			data_manager[`${day}`].splice(dayfind, 1);
			console.log(data_manager)
		}else {
			findID.remove();
		}
	}
}

function add_task_to_horary(){
	let horary = JSON.parse(localStorage.getItem('data_horary'));
	let keys = Object.keys(horary);
	keys.forEach((element) => {
		horary[element].forEach((data, i) => {
			document.querySelector(`.modify-horary-${data.day}`).innerHTML += 
			`
				<button class="btn btn-secondary" id="id-${data.id}" onclick="delHorary('${data.id}', '${data.day}')">${data.data} ✖</button>
			`
			;
		})
	})
}

function screen_horary(title){
	let screen2 = document.querySelector('.menu-application');
	let horary = localStorage.getItem('data_horary');
	screen2.innerHTML = `
		<div class="container">
			<br><br>
			<h1 class="text-center">${title}</h1>
			<div class="card">
			  <ul class="list-group list-group-flush">
			    <li class="list-group-item">Lunes: <div class="modify-horary-lunes"></div></li>
			    <li class="list-group-item">Martes: <div class="modify-horary-martes"></div></li>
			    <li class="list-group-item">Miercoles: <div class="modify-horary-miercoles"></div></li>
			    <li class="list-group-item">Jueves: <div class="modify-horary-jueves"></div></li>
			    <li class="list-group-item">Viernes: <div class="modify-horary-viernes"></div></li>
			    <li class="list-group-item">Sabado: <div class="modify-horary-sabado"></div></li>
			    <li class="list-group-item">Domingo: <div class="modify-horary-domingo"></div></li>
			  </ul>
			</div>
			<br>
			<form class="add-horary">
				<select name="horary" class="form-select">
				  <option value="lunes">Lunes</option>
				  <option value="martes">Martes</option>
				  <option value="miercoles">Miercoles</option>
				  <option value="jueves">Jueves</option>
				  <option value="viernes">Viernes</option>
				  <option value="sabado">Sabado</option>
				  <option value="domingo">Domingo</option>
				</select>
				<br>
				<input required type="text" placeholder="Cual es tu horario" class="form-control">
				<br>
				<button class="btn btn-primary">Añadir</button>
				<span class="btn btn-info" onclick="saveHorary()">Guardar Horario</span>
			</form>
		</div>
	`;

	if(horary){
		add_task_to_horary()
	}
	document.querySelector('.add-horary').addEventListener('submit', (e) => {
		e.preventDefault()

		let data = {
			day: e.target[0].value,
			matery: e.target[1].value,
			id: Math.floor(new Date()*Math.random())
		}

		data_manager[`${data.day}`].push({data: data.matery, id: data.id, day: data.day});
		document.querySelector(`.modify-horary-${data.day}`).innerHTML += 
		`
			<button class="btn btn-secondary" id="id-${data.id}" onclick="delHorary('${data.id}', '${data.day}')">${data.matery} ✖</button>
		`
		;
		e.target.reset()
	})
}

function updateTareas(){
	let finalHTML = "No hay Tareas";
	let tareas = localStorage.getItem('tareas');
	if(tareas){
		let json_tareas = JSON.parse(tareas);
		finalHTML = json_tareas.map(ch => `<div class="card ${ch.important}">
			<div class="card-body">
				<div class="description">Tarea: ${ch.description}</div>
				<div class="category">Categoria: ${ch.category}</div>
				<br>
				<button class="btn btn-danger" onclick="delTask('${ch.id}')">Eliminar</button>
			</div>
		</div>`);
	};
	return finalHTML;
}

function delTask(id){
	let tareas = JSON.parse(localStorage.getItem('tareas'));
	tareas.forEach((element, i, array) => {
		if(element.id == id){
			array.splice(i, 1);
			localStorage.setItem('tareas', JSON.stringify(array));
			document.querySelector('.all-tareas').innerHTML = updateTareas();
		}
	})
};

function add_task(){
	let data_nue = JSON.parse(localStorage.getItem('data_horary'))
	Swal.fire({
		title: "Añadir Tarea",
		html: `
		<div class="fire-task">
			<select name="horary" class="form-select selected-form">
			  <option value="lunes">Lunes</option>
			  <option value="martes">Martes</option>
			  <option value="miercoles">Miercoles</option>
			  <option value="jueves">Jueves</option>
			  <option value="viernes">Viernes</option>
			  <option value="sabado">Sabado</option>
			  <option value="domingo">Domingo</option>
			</select>
		</div>
		`,
		confirmButtonText: "Siguiente"
	}).then(() => {
		let fire_task = document.querySelector('.selected-form').value;
		Swal.fire({title: `Añadir Tarea a: ${fire_task}`, 
			html: 
			`
				<div class="fire-task2">
					<select name="data2" class="form-select data1">
						<option value="none" default="">Sin categoria</option>
						${data_nue[fire_task].map(ch => `
							<option value="${ch.data}">${ch.data}</option>
						`)}
					</select>
					<br>
					<input type="text" class="form-control data2" placeholder="descripción de la tarea">
					<br>
					<select name="data3" class="form-select data3">
						<option value="leve">Leve</option>
						<option value="moderado">Moderado</option>
						<option value="importante">Importante</option>
					</select>
				</div>
			`,
			confirmButtonText: "Guardar Tarea"
		}).then((data) => {
			let data1 = document.querySelector('.data1').value;
			let data2 = document.querySelector('.data2').value;
			let data3 = document.querySelector('.data3').value;

			let final_datas = {
				category: data1,
				description: data2,
				important: data3,
				id: Math.floor(new Date()*Math.random())
			}

			let tareas = localStorage.getItem('tareas');
			if(!tareas){
				localStorage.setItem('tareas', JSON.stringify([final_datas]));
			}else {
				let json_tareas = JSON.parse(tareas);
				json_tareas.push(final_datas);
				localStorage.setItem('tareas', JSON.stringify(json_tareas))
			}

			document.querySelector('.all-tareas').innerHTML = updateTareas();
		})
	})
}

function screen_card(){
	let screen2 = document.querySelector('.menu-application');
	screen2.innerHTML = 
	`
		<div class="container">
			<br>
			<h1 class="text-center">Tus Tareas Semanales</h1>
			<p class="text-center">Aqui encuentras todas tus tareas por completar</p>
			<br>
			<div class="all-tareas">
				${updateTareas()}
			</div>
			<div class="footer">
				<button class="btn btn-primary" onclick="add_task()">Añadir Tarea</button>
				<button class="btn btn-info" onclick="screen_horary('Horario Actual')">Ver O Modificar Horario</button>
			</div>
		</div>
	`;
}

window.onload = function(){
	let local_data = localStorage.getItem('data_horary');
	if(!local_data){
		screen_horary('Inicia con tu horario semanal');
	}else {
		screen_card()
	}
}
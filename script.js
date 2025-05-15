// Array para almacenar las reservas
let reservas = [];
let editIndex = null;

// Referencias a elementos del DOM
const form = document.getElementById('reserva-form');
const nombreInput = document.getElementById('nombre');
const matriculaInput = document.getElementById('matricula');
const actividadInput = document.getElementById('actividad');
const fechaInput = document.getElementById('fecha');
const tablaBody = document.querySelector('#tabla-reservas tbody');
const guardarBtn = document.getElementById('guardar-btn');
const cancelarBtn = document.getElementById('cancelar-btn');
const formTitle = document.getElementById('form-title');

// Función para validar matrícula
function validarMatricula(matricula) {
    return /^[A-Za-z0-9]{8}$/.test(matricula);
}

// Función para validar fecha (actual o futura)
function validarFecha(fecha) {
    const hoy = new Date();
    hoy.setHours(0,0,0,0);
    const fechaIngresada = new Date(fecha);
    return fechaIngresada >= hoy;
}

// Limpiar formulario
function limpiarFormulario() {
    form.reset();
    editIndex = null;
    guardarBtn.textContent = 'Guardar Reserva';
    cancelarBtn.classList.add('d-none');
    formTitle.textContent = 'Registrar Nueva Reserva';
    // Quitar clases de validación
    Array.from(form.elements).forEach(el => el.classList.remove('is-invalid'));
}

// Renderizar la tabla de reservas
function renderizarTabla() {
    tablaBody.innerHTML = '';
    reservas.forEach((reserva, idx) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${reserva.nombre}</td>
            <td>${reserva.matricula}</td>
            <td>${reserva.actividad}</td>
            <td>${reserva.fecha}</td>
            <td>
                <button class="btn btn-sm btn-primary me-2" onclick="editarReserva(${idx})">Editar</button>
                <button class="btn btn-sm btn-danger" onclick="eliminarReserva(${idx})">Eliminar</button>
            </td>
        `;
        tablaBody.appendChild(tr);
    });
}

// Manejar envío del formulario
form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Validaciones
    let valido = true;

    if (!nombreInput.value.trim()) {
        nombreInput.classList.add('is-invalid');
        valido = false;
    } else {
        nombreInput.classList.remove('is-invalid');
    }

    if (!validarMatricula(matriculaInput.value.trim())) {
        matriculaInput.classList.add('is-invalid');
        valido = false;
    } else {
        matriculaInput.classList.remove('is-invalid');
    }

    if (!actividadInput.value) {
        actividadInput.classList.add('is-invalid');
        valido = false;
    } else {
        actividadInput.classList.remove('is-invalid');
    }

    if (!fechaInput.value || !validarFecha(fechaInput.value)) {
        fechaInput.classList.add('is-invalid');
        valido = false;
    } else {
        fechaInput.classList.remove('is-invalid');
    }

    if (!valido) return;

    const nuevaReserva = {
        nombre: nombreInput.value.trim(),
        matricula: matriculaInput.value.trim(),
        actividad: actividadInput.value,
        fecha: fechaInput.value
    };

    if (editIndex === null) {
        // Crear nueva reserva
        reservas.push(nuevaReserva);
    } else {
        // Actualizar reserva existente
        reservas[editIndex] = nuevaReserva;
    }

    renderizarTabla();
    limpiarFormulario();
});

// Cancelar edición
cancelarBtn.addEventListener('click', limpiarFormulario);

// Editar reserva
window.editarReserva = function(idx) {
    const reserva = reservas[idx];
    nombreInput.value = reserva.nombre;
    matriculaInput.value = reserva.matricula;
    actividadInput.value = reserva.actividad;
    fechaInput.value = reserva.fecha;
    editIndex = idx;
    guardarBtn.textContent = 'Actualizar Reserva';
    cancelarBtn.classList.remove('d-none');
    formTitle.textContent = 'Editar Reserva';
};

// Eliminar reserva
window.eliminarReserva = function(idx) {
    if (confirm('¿Está seguro de eliminar esta reserva?')) {
        reservas.splice(idx, 1);
        renderizarTabla();
        limpiarFormulario();
    }
};

// Inicializar tabla vacía al cargar
renderizarTabla();
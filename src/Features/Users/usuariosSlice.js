import { createSlice } from '@reduxjs/toolkit';

const USERS_KEY = 'usuarios';
const CURRENT_USER_KEY = 'usuario_actual_id';
const SESSION_KEY = 'sesion_iniciada';

const normalizarXenero = (valor) => {
	if (valor === 'M' || valor === 'F') return valor;
	if (valor === 'masculino') return 'M';
	if (valor === 'feminino') return 'F';
	return 'F';
};

const normalizarAdmin = (valor, id, nome) => {
	const coincideConIsmael = id === 'ismael' || nome === 'Ismael Castiñeira';
	if (coincideConIsmael) return '1';
	return valor === '1' ? '1' : '0';
};

const normalizarUsuario = (usuario) => ({
	...usuario,
	contrasenha:
		typeof usuario?.contrasenha === 'string' && usuario.contrasenha.trim()
			? usuario.contrasenha
			: typeof usuario?.contrasinal === 'string' && usuario.contrasinal.trim()
				? usuario.contrasinal
			: `${usuario?.id || 'usuario'}1234`,
	xenero: normalizarXenero(usuario?.xenero),
	imaxePerfil: usuario?.imaxePerfil || '',
	admin: normalizarAdmin(usuario?.admin, usuario?.id, usuario?.nome),
});

const usuariosPorDefecto = [
	{
		id: 'ipardelo',
		nome: 'Ismael Castiñeira',
		contrasenha: '1234567890',
		idiomaPredeterminado: 'gl',
		temaPredeterminado: 'oscuro',
		xenero: 'M',
		admin: '1',
	},
	{
		id: 'niicoleept',
		nome: 'Nicole Papin',
		contrasenha: '1234567890',
		idiomaPredeterminado: 'es',
		temaPredeterminado: 'claro',
		xenero: 'F',
		admin: '0',
	},
	{
		id: 'daanieladas',
		nome: 'Daniela Castiñeira',
		contrasenha: '1234567890',
		idiomaPredeterminado: 'en',
		temaPredeterminado: 'claro',
		xenero: 'F',
		admin: '0',
	},
];

const cargarUsuarios = () => {
	try {
		const gardados = localStorage.getItem(USERS_KEY);
		if (!gardados) return usuariosPorDefecto;
		const parsed = JSON.parse(gardados);
		return Array.isArray(parsed) && parsed.length > 0
			? parsed.map(normalizarUsuario)
			: usuariosPorDefecto;
	} catch {
		return usuariosPorDefecto;
	}
};

const cargarUsuarioActualId = (usuarios) => {
	try {
		const gardado = localStorage.getItem(CURRENT_USER_KEY);
		if (gardado && usuarios.some((u) => u.id === gardado)) return gardado;
		return usuarios[0]?.id || null;
	} catch {
		return usuarios[0]?.id || null;
	}
};

const usuariosIniciales = cargarUsuarios();
const sesionInicial = (() => {
	try {
		return localStorage.getItem(SESSION_KEY) === '1';
	} catch {
		return false;
	}
})();

const usuariosSlice = createSlice({
	name: 'usuarios',
	initialState: {
		lista: usuariosIniciales,
		usuarioActualId: sesionInicial ? cargarUsuarioActualId(usuariosIniciales) : null,
		sesionIniciada: sesionInicial,
		erroInicioSesion: '',
	},
	reducers: {
		hidratarUsuarios: (state, action) => {
			const lista = action.payload?.lista;
			const usuarioActualId = action.payload?.usuarioActualId;
			if (Array.isArray(lista) && lista.length > 0) {
				state.lista = lista.map(normalizarUsuario);
			}
			if (usuarioActualId && state.lista.some((u) => u.id === usuarioActualId)) {
				state.usuarioActualId = usuarioActualId;
			}
		},
		iniciarSesion: (state, action) => {
			const { id, contrasenha } = action.payload || {};
			const usuario = state.lista.find((u) => u.id === (id || '').trim());
			if (!usuario || usuario.contrasenha !== (contrasenha || '').trim()) {
				state.sesionIniciada = false;
				state.erroInicioSesion = 'INVALID_CREDENTIALS';
				try {
					localStorage.removeItem(SESSION_KEY);
				} catch {
					/* empty */
				}
				return;
			}
			state.usuarioActualId = usuario.id;
			state.sesionIniciada = true;
			state.erroInicioSesion = '';
			localStorage.setItem(CURRENT_USER_KEY, usuario.id);
			localStorage.setItem(SESSION_KEY, '1');
		},
		pecharSesion: (state) => {
			state.sesionIniciada = false;
			state.erroInicioSesion = '';
			state.usuarioActualId = null;
			try {
				localStorage.removeItem(SESSION_KEY);
			} catch {
				/* empty */
			}
		},
		cambiarUsuario: (state, action) => {
			if (!state.sesionIniciada) return;
			const novoId = action.payload;
			if (!state.lista.some((u) => u.id === novoId)) return;
			state.usuarioActualId = novoId;
			localStorage.setItem(CURRENT_USER_KEY, novoId);
		},
		establecerXeneroUsuarioActual: (state, action) => {
			const xenero = normalizarXenero(action.payload);
			const usuario = state.lista.find((u) => u.id === state.usuarioActualId);
			if (!usuario) return;
			usuario.xenero = xenero;
			localStorage.setItem(USERS_KEY, JSON.stringify(state.lista));
		},
		actualizarPreferenciasUsuarioActual: (state, action) => {
			const usuario = state.lista.find((u) => u.id === state.usuarioActualId);
			if (!usuario) return;
			const payload = action.payload || {};
			if (typeof payload.imaxePerfil === 'string') usuario.imaxePerfil = payload.imaxePerfil.trim();
			if (['gl', 'es', 'en'].includes(payload.idiomaPredeterminado)) {
				usuario.idiomaPredeterminado = payload.idiomaPredeterminado;
			}
			if (['claro', 'oscuro'].includes(payload.temaPredeterminado)) {
				usuario.temaPredeterminado = payload.temaPredeterminado;
			}
			if (payload.xenero) usuario.xenero = normalizarXenero(payload.xenero);
			if (typeof payload.contrasenha === 'string' && payload.contrasenha.trim()) {
				usuario.contrasenha = payload.contrasenha.trim();
			}
			localStorage.setItem(USERS_KEY, JSON.stringify(state.lista));
		},
		rexistrarUsuario: (state, action) => {
			const actual = state.lista.find((u) => u.id === state.usuarioActualId);
			if (!actual || actual.admin !== '1') return;
			const payload = action.payload || {};
			const novoId = (payload.id || '').trim();
			const novoNome = (payload.nome || '').trim();
			if (!novoId || !novoNome) return;
			if (state.lista.some((u) => u.id === novoId)) return;
			state.lista.push(
				normalizarUsuario({
					id: novoId,
					nome: novoNome,
					contrasenha: (payload.contrasenha || `${novoId}1234`).trim(),
					idiomaPredeterminado: payload.idiomaPredeterminado || 'gl',
					temaPredeterminado: payload.temaPredeterminado || 'claro',
					xenero: payload.xenero || 'F',
					imaxePerfil: payload.imaxePerfil || '',
					admin: payload.admin || '0',
				})
			);
			localStorage.setItem(USERS_KEY, JSON.stringify(state.lista));
		},
		rexistrarDesdeLogin: (state, action) => {
			const payload = action.payload || {};
			const novoId = (payload.id || '').trim();
			const novoNome = (payload.nome || '').trim();
			const novaContrasenha = (payload.contrasenha || '').trim();
			if (!novoId || !novoNome || !novaContrasenha) return;
			if (state.lista.some((u) => u.id === novoId)) return;
			state.lista.push(
				normalizarUsuario({
					id: novoId,
					nome: novoNome,
					contrasenha: novaContrasenha,
					idiomaPredeterminado: payload.idiomaPredeterminado || 'gl',
					temaPredeterminado: payload.temaPredeterminado || 'claro',
					xenero: payload.xenero || 'F',
					imaxePerfil: payload.imaxePerfil || '',
					admin: '0',
				})
			);
			localStorage.setItem(USERS_KEY, JSON.stringify(state.lista));
		},
		cambiarContrasenhaDesdeLogin: (state, action) => {
			const { id, contrasenha } = action.payload || {};
			const usuarioId = (id || '').trim();
			const novaContrasenha = (contrasenha || '').trim();
			if (!usuarioId || !novaContrasenha) return;
			const usuario = state.lista.find((u) => u.id === usuarioId);
			if (!usuario) return;
			usuario.contrasenha = novaContrasenha;
			localStorage.setItem(USERS_KEY, JSON.stringify(state.lista));
		},
		actualizarUsuario: (state, action) => {
			const actual = state.lista.find((u) => u.id === state.usuarioActualId);
			if (!actual || actual.admin !== '1') return;
			const { id, ...cambios } = action.payload || {};
			if (!id) return;
			const indice = state.lista.findIndex((u) => u.id === id);
			if (indice === -1) return;
			const usuarioActualizado = {
				...state.lista[indice],
				...cambios,
				id,
				nome: (cambios.nome ?? state.lista[indice].nome ?? '').trim(),
				imaxePerfil:
					typeof cambios.imaxePerfil === 'string'
						? cambios.imaxePerfil.trim()
						: state.lista[indice].imaxePerfil || '',
				contrasenha:
					typeof cambios.contrasenha === 'string' && cambios.contrasenha.trim()
						? cambios.contrasenha.trim()
						: state.lista[indice].contrasenha,
			};
			if (!usuarioActualizado.nome) return;
			state.lista[indice] = normalizarUsuario(usuarioActualizado);
			localStorage.setItem(USERS_KEY, JSON.stringify(state.lista));
		},
		eliminarUsuario: (state, action) => {
			const actual = state.lista.find((u) => u.id === state.usuarioActualId);
			if (!actual || actual.admin !== '1') return;
			const idAEliminar = action.payload;
			if (!idAEliminar || idAEliminar === 'ismael' || idAEliminar === state.usuarioActualId) return;
			state.lista = state.lista.filter((u) => u.id !== idAEliminar);
			localStorage.setItem(USERS_KEY, JSON.stringify(state.lista));
		},
	},
});

export const {
	hidratarUsuarios,
	iniciarSesion,
	pecharSesion,
	cambiarUsuario,
	establecerXeneroUsuarioActual,
	actualizarPreferenciasUsuarioActual,
	rexistrarUsuario,
	rexistrarDesdeLogin,
	cambiarContrasenhaDesdeLogin,
	actualizarUsuario,
	eliminarUsuario,
} = usuariosSlice.actions;
export const seleccionarUsuarios = (state) => state.usuarios.lista;
export const seleccionarUsuarioActualId = (state) => state.usuarios.usuarioActualId;
export const seleccionarSesionIniciada = (state) => state.usuarios.sesionIniciada === true;
export const seleccionarErroInicioSesion = (state) => state.usuarios.erroInicioSesion || '';
export const seleccionarUsuarioActual = (state) =>
	state.usuarios.lista.find((u) => u.id === state.usuarios.usuarioActualId) || null;
export const seleccionarUsuariosExceptoActual = (state) =>
	state.usuarios.lista.filter((u) => u.id !== state.usuarios.usuarioActualId);
export const seleccionarUsuarioActualAdmin = (state) =>
	(state.usuarios.lista.find((u) => u.id === state.usuarios.usuarioActualId)?.admin || '0') === '1';

export default usuariosSlice.reducer;

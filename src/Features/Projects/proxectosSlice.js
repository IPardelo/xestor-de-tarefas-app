import { createSlice, nanoid } from '@reduxjs/toolkit';

const estadoInicial = {
	lista: [],
};

const COLOR_PROXECTO_POR_DEFECTO = '#9333ea';

const normalizarProxecto = (proxecto = {}) => ({
	...proxecto,
	id: proxecto.id || nanoid(),
	nome: proxecto.nome || '',
	clienteNome: proxecto.clienteNome || '',
	clienteTelefono: proxecto.clienteTelefono || '',
	clienteEmail: proxecto.clienteEmail || '',
	url: proxecto.url || '',
	prezoAcordado: proxecto.prezoAcordado || '',
	dataLimiteEntrega: proxecto.dataLimiteEntrega || '',
	cor: proxecto.cor || COLOR_PROXECTO_POR_DEFECTO,
	creadoEn: proxecto.creadoEn || new Date().toISOString(),
});

const proxectosSlice = createSlice({
	name: 'proxectos',
	initialState: estadoInicial,
	reducers: {
		hidratarProxectos: (state, action) => {
			const lista = action.payload?.lista;
			if (Array.isArray(lista)) {
				state.lista = lista.map(normalizarProxecto);
			}
		},
		engadirProxecto: (state, action) => {
			state.lista.unshift(
				normalizarProxecto({
					...action.payload,
					id: nanoid(),
					creadoEn: new Date().toISOString(),
				})
			);
		},
		actualizarProxecto: (state, action) => {
			const { id, ...cambios } = action.payload || {};
			if (!id) return;
			const indice = state.lista.findIndex((proxecto) => proxecto.id === id);
			if (indice === -1) return;
			state.lista[indice] = normalizarProxecto({
				...state.lista[indice],
				...cambios,
				id,
				creadoEn: state.lista[indice].creadoEn,
			});
		},
		eliminarProxecto: (state, action) => {
			const proxectoId = action.payload;
			if (!proxectoId) return;
			state.lista = state.lista.filter((proxecto) => proxecto.id !== proxectoId);
		},
	},
});

export const {
	hidratarProxectos,
	engadirProxecto,
	actualizarProxecto,
	eliminarProxecto,
} =
	proxectosSlice.actions;
export const seleccionarProxectos = (state) => state.proxectos.lista || [];
export default proxectosSlice.reducer;

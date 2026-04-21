# XestorDeTarefas Android

Aplicación Android de xestión persoal de tarefas e proxectos feita con React + Redux Toolkit + Capacitor.

## Repositorios

- Android (este repo): [IPardelo/xestor-de-tarefas-app](https://github.com/IPardelo/xestor-de-tarefas-app)
- Web/escritorio: [IPardelo/xestor-de-tarefas-web](https://github.com/IPardelo/xestor-de-tarefas-web)

Inclúe multiusuario local, proxectos, calendario, internacionalización (`gl`/`es`/`en`) e sincronización multi-dispositivo con Firebase Firestore.

![XestorDeTarefas Screenshot](public/Images/Interfaz.gif)

## Características actuais

- Xestión de tarefas: crear, editar, eliminar, completar, buscar, filtrar e ordenar.
- Campos de tarefa: título, descrición, tipo (`Tarefa` ou `Reunión`), prioridade, data límite, proxecto, asignación e compartición.
- Regras de formulario: na creación de tarefas todos os campos son obrigatorios agás data límite e compartir con.
- Xestión de usuarios en local (con rol admin) e cambio de usuario.
- Xestión de proxectos con datos de cliente.
- Vista de calendario anual/mensual.
- Persistencia e sincronización con Firebase Firestore (estado compartido).
- Tema da app adaptado ao modo claro/escuro do sistema Android.

## Requisitos

- Node.js 18+ (recomendado 20+)
- npm
- Android Studio
- Android SDK
- Dispositivo Android ou emulador

## Configuración

1) Instalar dependencias:

```bash
npm install
```

2) Configurar Firebase:

- copia `.env.example` a `.env`
- completa as variables `VITE_FIREBASE_*`

## Arranque en Android

1) Compilar a app web e sincronizar con Android:

```bash
npm run android:sync
```

2) Abrir o proxecto nativo:

```bash
npm run android:open
```

3) En Android Studio:

- espera ao sync de Gradle
- selecciona dispositivo/emulador
- preme **Run**

## Scripts dispoñibles

- `npm run android:sync` - build web + sync Android.
- `npm run android:open` - abre Android Studio.
- `npm run android:run` - sync e execución directa.
- `npm run build` - build web de produción.
- `npm run lint` - lint do código.

## Modo multiusuario real (Firebase)

Para usar a mesma app desde varios dispositivos Android e compartir cambios:

1) Crea un proxecto en Firebase e activa Firestore.
2) Enche cos datos necesarios o arquivo `.env.example` na raíz do proxecto e renomeao a `.env`.
3) Executa o fluxo Android (`npm run android:sync` + `npm run android:open`) nos dispositivos que queiras.

A app usa Firestore como persistencia principal e sincroniza cambios entre sesións.

## Estrutura xeral

```text
src/
  App/                # Store e persistencia
  Components/         # UI por áreas (Tasks, Projects, Layout, Options...)
  Features/           # Slices Redux (Tasks, Users, Projects, Theme, Language)
  i18n/               # Traducións
android/              # Proxecto nativo Android (Capacitor)
capacitor.config.json # Configuración de integración nativa
```

## Tecnoloxías

- React 19
- Redux Toolkit
- Capacitor 8
- Firebase Firestore
- Vite 6
- Framer Motion

## Licenza

MIT. Ver `LICENSE`.

## Autor

[Ismael Castiñeira](https://ipardelo.es)

```bash
VIVA GHALISIA E A COSTA DA MORTE! 💀
```
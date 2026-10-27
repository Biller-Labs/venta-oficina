# Venta de oficina

Catálogo estático en español, con precios en USD y consultas por WhatsApp. Retiro en WTC.

## Vista previa local

Desde esta carpeta, ejecutá:

```sh
python3 -m http.server 8000
```

Abrí http://localhost:8000. No abras `index.html` directamente: el catálogo carga `items.json` mediante HTTP.

## Editar artículos

Editá `items.json`. Cada artículo tiene un identificador único, nombre, descripción, precio, estado y una lista de rutas de fotos. Actualmente se muestra la primera foto; al hacer clic se abre en tamaño completo.

- `precio`: número en USD (por ejemplo, `80`), o `null` para mostrar “Consultar precio”.
- `estado`: `disponible`, `reservado` o `vendido`. Los vendidos no tienen botón de consulta.
- `imagenes`: ruta relativa de la foto, respetando mayúsculas y extensión.

Las fotos actuales están en la raíz. Podés agregar nuevas fotos allí o crear una carpeta `images/` y usar rutas como `images/silla.jpeg`.

## Publicar en GitHub Pages

1. Subí los archivos a la rama `main` de tu repositorio de GitHub.
2. En **Settings → Pages**, elegí **Deploy from a branch**.
3. Seleccioná **main** y **/ (root)**, y guardá.
4. Abrí la dirección que muestra GitHub cuando termine la publicación.

Para actualizar el catálogo, modificá los archivos y subí un nuevo commit. No requiere compilación ni dependencias.

El catálogo, las fotos y el número de contacto serán públicos. No publiques datos privados ni la dirección exacta de retiro.

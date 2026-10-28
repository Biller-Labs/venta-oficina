const statuses = { disponible: 'Disponible', reservado: 'Reservado', vendido: 'Vendido' };
const currency = new Intl.NumberFormat('es-UY', { maximumFractionDigits: 2 });

const photoDialog = document.createElement('dialog');
photoDialog.className = 'photo-dialog';
photoDialog.setAttribute('aria-label', 'Vista ampliada de la foto');
const closePhoto = document.createElement('button');
closePhoto.type = 'button';
closePhoto.className = 'close-photo';
closePhoto.textContent = 'Cerrar ×';
closePhoto.autofocus = true;
const enlargedPhoto = document.createElement('img');
photoDialog.append(closePhoto, enlargedPhoto);
document.body.append(photoDialog);
closePhoto.addEventListener('click', () => photoDialog.close());
photoDialog.addEventListener('click', (event) => {
  if (event.target !== photoDialog) return;
  const bounds = photoDialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right ||
      event.clientY < bounds.top || event.clientY > bounds.bottom) photoDialog.close();
});
photoDialog.addEventListener('close', () => {
  document.body.classList.remove('photo-open');
  enlargedPhoto.removeAttribute('src');
});

async function loadCatalog() {
  const message = document.querySelector('#message');
  try {
    const response = await fetch('items.json');
    if (!response.ok) throw new Error('No se pudo cargar el catálogo');
    const items = await response.json();
    const catalog = document.querySelector('#catalog');
    const search = document.querySelector('#search');
    const normalize = (text) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const searchableCards = [];

    for (const item of items) {
      if (item.estado === 'vendido') continue;
      const card = document.createElement('article');
      card.className = 'card';
      const photoLink = document.createElement('button');
      photoLink.type = 'button';
      photoLink.className = 'photo-link';
      photoLink.setAttribute('aria-label', `Ver foto de ${item.nombre} en tamaño completo`);
      const image = document.createElement('img');
      image.src = item.imagenes[0];
      image.alt = item.nombre;
      image.loading = 'lazy';
      photoLink.append(image);
      photoLink.addEventListener('click', () => {
        enlargedPhoto.src = image.src;
        enlargedPhoto.alt = item.nombre;
        photoDialog.setAttribute('aria-label', `Foto de ${item.nombre}`);
        photoDialog.showModal();
        document.body.classList.add('photo-open');
      });

      const gallery = document.createElement('div');
      gallery.className = 'gallery';
      if (item.imagenes.length > 1) {
        for (const [index, path] of item.imagenes.entries()) {
          const button = document.createElement('button');
          button.type = 'button';
          button.setAttribute('aria-label', `Ver foto ${index + 1} de ${item.nombre}`);
          button.setAttribute('aria-pressed', String(index === 0));
          const thumbnail = document.createElement('img');
          thumbnail.src = path;
          thumbnail.alt = '';
          thumbnail.loading = 'lazy';
          button.append(thumbnail);
          button.addEventListener('click', () => {
            image.src = path;
            for (const sibling of gallery.children) sibling.setAttribute('aria-pressed', String(sibling === button));
          });
          gallery.append(button);
        }
      }

      const content = document.createElement('div');
      content.className = 'card-content';
      const status = document.createElement('span');
      status.className = `status ${item.estado}`;
      status.textContent = statuses[item.estado] || item.estado;
      const title = document.createElement('h3');
      title.textContent = item.nombre;
      const description = document.createElement('p');
      description.className = 'description';
      description.textContent = item.descripcion;
      const price = document.createElement('p');
      price.className = 'price';
      price.textContent = typeof item.precio === 'number' ? `USD ${currency.format(item.precio)}` : '';
      content.append(status, title);
      if (item.descripcion.trim()) content.append(description);
      if (typeof item.precio === 'number') content.append(price);

      if (item.estado !== 'vendido') {
        const contact = document.createElement('a');
        contact.className = 'contact';
        const text = `Hola, me interesa «${item.nombre}» del catálogo Venta de oficina. ¿Sigue disponible?`;
        contact.href = `https://wa.me/59896403954?text=${encodeURIComponent(text)}`;
        contact.target = '_blank';
        contact.rel = 'noopener noreferrer';
        contact.textContent = 'Consultar por WhatsApp ↗';
        content.append(contact);
      }
      card.append(photoLink, gallery, content);
      catalog.append(card);
      searchableCards.push({ card, text: normalize(`${item.nombre} ${item.descripcion}`) });
    }
    const filterCatalog = () => {
      const terms = normalize(search.value).trim().split(/\s+/).filter(Boolean);
      let count = 0;
      for (const { card, text } of searchableCards) {
        card.hidden = !terms.every((term) => text.includes(term));
        if (!card.hidden) count++;
      }
      message.textContent = items.length ? 'No encontramos artículos con esa búsqueda.' : 'Pronto vamos a publicar artículos.';
      message.hidden = count > 0;
    };
    search.disabled = false;
    search.addEventListener('input', filterCatalog);
    filterCatalog();
  } catch (error) {
    message.textContent = 'No pudimos cargar los artículos. Recargá la página o consultanos por WhatsApp al pie.';
    console.error(error);
  }
}

loadCatalog();

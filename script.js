const statuses = { disponible: 'Disponible', reservado: 'Reservado', vendido: 'Vendido' };
const currency = new Intl.NumberFormat('es-UY', { maximumFractionDigits: 2 });

async function loadCatalog() {
  const message = document.querySelector('#message');
  try {
    const response = await fetch('items.json');
    if (!response.ok) throw new Error('No se pudo cargar el catálogo');
    const items = await response.json();
    const catalog = document.querySelector('#catalog');

    for (const item of items) {
      const card = document.createElement('article');
      card.className = 'card';
      const photoLink = document.createElement('a');
      photoLink.href = item.imagenes[0];
      photoLink.target = '_blank';
      photoLink.rel = 'noopener noreferrer';
      photoLink.className = 'photo-link';
      photoLink.setAttribute('aria-label', `Ver foto de ${item.nombre} en tamaño completo`);
      const image = document.createElement('img');
      image.src = item.imagenes[0];
      image.alt = item.nombre;
      image.loading = 'lazy';
      photoLink.append(image);

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
            photoLink.href = path;
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
      price.textContent = typeof item.precio === 'number' ? `USD ${currency.format(item.precio)}` : 'Consultar precio';
      content.append(status, title, description, price);

      if (item.estado !== 'vendido') {
        const contact = document.createElement('a');
        contact.className = 'contact';
        const text = `Hola, me interesa «${item.nombre}» del catálogo Venta de oficina. ¿Sigue disponible?`;
        contact.href = `https://wa.me/59892155000?text=${encodeURIComponent(text)}`;
        contact.target = '_blank';
        contact.rel = 'noopener noreferrer';
        contact.textContent = 'Consultar por WhatsApp ↗';
        content.append(contact);
      }
      card.append(photoLink, gallery, content);
      catalog.append(card);
    }
    document.querySelector('#item-count').textContent = `${items.length} artículos`;
    message.textContent = items.length ? '' : 'Pronto vamos a publicar artículos.';
    message.hidden = items.length > 0;
  } catch (error) {
    message.textContent = 'No pudimos cargar los artículos. Recargá la página o consultanos por WhatsApp al pie.';
    console.error(error);
  }
}

loadCatalog();

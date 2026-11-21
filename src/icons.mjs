const paths = {
  book: '<path d="M12 5.5C8 3.1 4.4 3.7 2 4.5V19c3.6-1 6.5-.7 10 1.5 3.5-2.2 6.4-2.5 10-1.5V4.5c-2.4-.8-6-1.4-10 1zM12 5.5v15"/>',
  bookmark: '<path d="M6 4.5c0-.8.6-1.5 1.5-1.5h9c.9 0 1.5.7 1.5 1.5V21l-6-4-6 4z"/>',
  bag: '<rect x="4" y="7.5" width="16" height="13" rx="2"/><path d="M8 8V6a4 4 0 0 1 8 0v2"/>',
  leaf: '<path d="M12 20v-7M12 15C6 16 3 12 3 7c5 0 9 2 9 8zm0-3c0-6 3-9 9-9 0 6-3 9-9 9z"/>',
  globe: '<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4.2" ry="9"/><path d="M3.5 10h17M4.3 15h15.4"/>',
  download: '<path d="M12 3v12m-5-5 5 5 5-5M4 16v4h16v-4"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1.3"/><rect x="14" y="3" width="7" height="7" rx="1.3"/><rect x="3" y="14" width="7" height="7" rx="1.3"/><rect x="14" y="14" width="7" height="7" rx="1.3"/>',
  mail: '<rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="m3.5 6 8.5 7 8.5-7"/>',
  video: '<path d="m3 8.5 17.5-4-1-4-17.5 4zM5 4l3 3m2-4 3 3m2-4 3 3"/><path d="M3 9h18v11H3z"/><path d="m10 12 4 2.5-4 2.5z"/>',
  menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
  check: '<path d="m3.5 12 5.4 5.5L20 6.5"/>',
  heart: '<path d="M12 20S2.5 14.2 2.5 8a5 5 0 0 1 9.5-2A5 5 0 0 1 21.5 8c0 6.2-9.5 12-9.5 12z"/>'
};
export const icon=(name)=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.65" class="icon" aria-hidden="true">${paths[name]}</svg>`;
export const flower='<svg aria-hidden="true" class="flower" viewBox="0 0 50 50"><g stroke="currentColor" stroke-width="7.6" stroke-linecap="round">'+Array.from({length:8},(_,i)=>`<path d="M25 6v11" transform="rotate(${45*i} 25 25)"/>`).join('')+'</g><circle cx="25" cy="25" r="5" fill="currentColor"/></svg>';

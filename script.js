document.addEventListener('DOMContentLoaded', () => {
    const itemList = document.getElementById('itemList');
    const iframe = document.getElementById('previewFrame');
    let activeId = null;

    // Helper to load interaction into iframe
    function loadInteraction(path) {
        if (iframe) {
            iframe.src = path;
        }
    }

    // Render list items
    function renderList() {
        // Check if interactionData exists (loaded from interactions.js)
        if (typeof interactionData === 'undefined') {
            console.error('interactionData not found. Make sure interactions.js is loaded.');
            return;
        }

        itemList.innerHTML = '';
        const data = interactionData;

        // 1. Separate "AX" from the main list
        const axInteraction = data.find(item => item.title === 'AX' || item.title === 'Ax');
        const listItems = data.filter(item => item.title !== 'AX' && item.title !== 'Ax');

        // 2. Clear old AX header content
        const axHeader = document.getElementById('ax-header');
        if (axHeader) axHeader.innerHTML = '';

        if (axInteraction && axHeader) {
            // Render AX as a list item inside the header container
            const li = document.createElement('li');
            li.textContent = axInteraction.title;
            li.dataset.path = axInteraction.path;
            li.className = 'ax-item'; // Special class for styling

            li.addEventListener('click', () => {
                loadInteraction(axInteraction.path);
                // Remove active class from main list
                document.querySelectorAll('.item-list li').forEach(el => el.classList.remove('active'));
                li.classList.add('active');
            });

            axHeader.appendChild(li); // Add to separate container

            // Load AX by default on start
            if (!activeId) {
                loadInteraction(axInteraction.path);
                li.classList.add('active');
            }
        }

        // Fallback if AX not found but we have items
        if (!axInteraction && listItems.length > 0 && !activeId) {
            loadInteraction(listItems[0].path);
        }

        // 3. Render the rest of the list
        if (listItems.length > 0) {
            listItems.forEach((item, index) => {
                const li = document.createElement('li');
                li.textContent = item.title;
                li.dataset.path = item.path;

                li.addEventListener('click', () => {
                    loadInteraction(item.path);

                    // Update UI
                    document.querySelectorAll('.item-list li').forEach(el => el.classList.remove('active'));
                    // Ensure AX active state is removed
                    if (axHeader && axHeader.querySelector('li')) axHeader.querySelector('li').classList.remove('active');

                    li.classList.add('active');
                });

                if (itemList) {
                    itemList.appendChild(li);
                }
            });
        }
    }

    // Set active item and update iframe
    function setActive(id) {
        if (activeId === id) return;

        activeId = id;

        // Update UI
        const listItems = itemList.querySelectorAll('li');
        listItems.forEach(li => {
            if (li.dataset.id === id) {
                li.classList.add('active');
                // Update iframe source
                const data = interactionData.find(d => d.id === id);
                if (data) {
                    iframe.src = data.path;
                }
            } else {
                li.classList.remove('active');
            }
        });
    }

    renderList();
});

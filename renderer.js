const { ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');

const sidebarContainer = document.querySelector('.sidebar-container');
const shortcutsContainer = document.getElementById('shortcutsContainer');
const tooltip = document.getElementById('tooltip');
const tooltipName = document.getElementById('tooltipName');
const tooltipPath = document.getElementById('tooltipPath');

let shortcuts = [];
let iconCache = new Map();

function loadShortcuts() {
    const saved = localStorage.getItem('shortcuts');
    if (saved) {
        shortcuts = JSON.parse(saved);
        renderShortcuts();
    }
}

function saveShortcuts() {
    localStorage.setItem('shortcuts', JSON.stringify(shortcuts));
}

async function getFileIcon(filePath) {
    if (iconCache.has(filePath)) {
        return iconCache.get(filePath);
    }
    
    console.log('Getting icon for:', filePath);
    
    try {
        if (fs.existsSync(filePath)) {
            const dataUrl = await ipcRenderer.invoke('get-file-icon', filePath);
            if (dataUrl) {
                const html = `<img src="${dataUrl}" style="width: 36px; height: 36px; object-fit: contain;" />`;
                iconCache.set(filePath, html);
                console.log('Icon loaded successfully for:', filePath);
                return html;
            } else {
                console.log('No icon returned for:', filePath);
            }
        } else {
            console.log('File does not exist:', filePath);
        }
    } catch (err) {
        console.error('Error loading icon for:', filePath, err);
    }
    
    const ext = path.extname(filePath).toLowerCase();
    let fallbackIcon;
    
    if (!ext || (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory())) {
        fallbackIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
        </svg>`;
    } else {
        fallbackIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
            <polyline points="13 2 13 9 20 9"></polyline>
        </svg>`;
    }
    
    console.log('Using fallback icon for:', filePath);
    iconCache.set(filePath, fallbackIcon);
    return fallbackIcon;
}

async function renderShortcuts() {
    if (shortcuts.length === 0) {
        shortcutsContainer.innerHTML = '';
        updateWindowHeight();
        return;
    }
    
    const items = await Promise.all(shortcuts.map(async (shortcut, index) => {
        const icon = await getFileIcon(shortcut.path);
        return `
            <div class="shortcut-item" data-index="${index}" data-path="${shortcut.path}" data-name="${shortcut.name}">
                <div class="shortcut-icon">
                    ${icon}
                </div>
                <button class="shortcut-delete" data-index="${index}">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
        `;
    }));
    
    shortcutsContainer.innerHTML = items.join('');
    
    document.querySelectorAll('.shortcut-item').forEach(item => {
        item.addEventListener('click', (e) => {
            if (!e.target.closest('.shortcut-delete')) {
                const filePath = item.dataset.path;
                ipcRenderer.send('open-path', filePath);
            }
        });
        
        item.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            const index = parseInt(item.dataset.index);
            if (confirm('Διαγραφή αυτής της συντόμευσης;')) {
                shortcuts.splice(index, 1);
                saveShortcuts();
                renderShortcuts();
            }
        });
        
        item.addEventListener('mouseenter', (e) => {
            showTooltip(item.dataset.name, item.dataset.path, e);
        });
        
        item.addEventListener('mouseleave', () => {
            hideTooltip();
        });
    });
    
    document.querySelectorAll('.shortcut-delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const index = parseInt(btn.dataset.index);
            shortcuts.splice(index, 1);
            saveShortcuts();
            renderShortcuts();
        });
    });
    
    updateWindowHeight();
}

function updateWindowHeight() {
    const itemHeight = 56;
    const padding = 12;
    const minHeight = 60;
    
    const totalHeight = shortcuts.length > 0 
        ? (shortcuts.length * itemHeight) + padding
        : minHeight;
    
    ipcRenderer.send('resize-window', totalHeight);
}

async function addShortcut(filePath) {
    if (!fs.existsSync(filePath)) {
        return;
    }
    
    const alreadyExists = shortcuts.some(s => s.path === filePath);
    if (alreadyExists) {
        return;
    }
    
    const fileName = path.basename(filePath);
    
    shortcuts.push({
        name: fileName,
        path: filePath
    });
    
    saveShortcuts();
    await renderShortcuts();
}

function showTooltip(name, filePath, event) {
    const item = event.target.closest('.shortcut-item');
    if (!item) {
        console.log('No shortcut item found for tooltip');
        return;
    }
    
    let displayName = name;
    if (displayName.toLowerCase().endsWith('.lnk')) {
        displayName = displayName.substring(0, displayName.length - 4);
    }
    
    tooltipName.textContent = displayName;
    tooltipPath.textContent = filePath;
    
    const rect = item.getBoundingClientRect();
    const tooltipTop = rect.top + (rect.height / 2) - 40;
    
    tooltip.style.top = tooltipTop + 'px';
    tooltip.classList.add('visible');
    
    console.log('Tooltip visible:', {
        displayName,
        top: tooltipTop,
        tooltipElement: tooltip,
        hasClass: tooltip.classList.contains('visible')
    });
}

function hideTooltip() {
    tooltip.classList.remove('visible');
    console.log('Tooltip hidden');
}

sidebarContainer.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
    sidebarContainer.classList.add('drag-over');
});

sidebarContainer.addEventListener('dragleave', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.target === sidebarContainer) {
        sidebarContainer.classList.remove('drag-over');
    }
});

sidebarContainer.addEventListener('drop', async (e) => {
    e.preventDefault();
    e.stopPropagation();
    sidebarContainer.classList.remove('drag-over');
    
    const files = Array.from(e.dataTransfer.files);
    for (const file of files) {
        await addShortcut(file.path);
    }
});

document.addEventListener('dragover', (e) => {
    e.preventDefault();
});

document.addEventListener('drop', (e) => {
    e.preventDefault();
});

loadShortcuts();

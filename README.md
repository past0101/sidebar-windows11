# Windows 11 Sidebar

Ένα σύγχρονο, διαφανές sidebar για Windows 11 με δυνατότητα drag-and-drop για γρήγορη πρόσβαση σε εφαρμογές και αρχεία.

## Χαρακτηριστικά

**Design**
- Ultra-transparent glassmorphism με 60px blur effect
- Gradient overlay με χρώματα μπλε, μωβ, ροζ
- Rounded corners (20px border-radius)
- Smooth animations με cubic-bezier transitions
- 60px width - εξαιρετικά διακριτικό

**Windows Native Icons**
- Διαβάζει πραγματικά Windows icons από shortcuts (.lnk files)
- Υποστηρίζει όλους τους τύπους αρχείων (.exe, .lnk, folders)
- Icon caching για γρήγορη φόρτωση
- Resolves shortcut targets αυτόματα

**Tooltips**
- Εμφανίζονται εκτός του sidebar στα αριστερά
- Δείχνουν το καθαρό όνομα της εφαρμογής
- Smooth fade in/out animation

**Λειτουργικότητα**
- Drag & Drop από οπουδήποτε
- Right-click για διαγραφή
- localStorage persistence
- Κεντραρισμένο κάθετα στη δεξιά άκρη της οθόνης
- Δυναμικό ύψος ανάλογα με τα icons
- System tray icon
- Auto-startup με τα Windows

## Εγκατάσταση

### Απαιτήσεις
- Windows 10 ή Windows 11
- Node.js (v16 ή νεότερο)
- npm

### Βήματα

1. Clone το repository
```bash
git clone https://github.com/past0101/sidebar-windows11.git
cd sidebar-windows11
```

2. Εγκατάσταση dependencies
```bash
npm install
```

3. Εκτέλεση της εφαρμογής
```bash
npm start
```

## Χρήση

**Προσθήκη Shortcuts**
1. Σύρε οποιοδήποτε αρχείο, φάκελο ή shortcut στο sidebar
2. Το icon θα εμφανιστεί αυτόματα με το native Windows icon
3. Hover πάνω από το icon για να δεις το όνομα

**Διαγραφή Shortcuts**
- Right-click πάνω σε ένα icon και επιβεβαίωσε τη διαγραφή

**System Tray**
- Το app τρέχει στα hidden icons
- Right-click στο tray icon για Show/Hide/Exit

## Build σε Εκτελέσιμο (.exe)

### Μέθοδος 1: Portable Build (Recommended)

Αυτή είναι η απλούστερη μέθοδος που δουλεύει πάντα:

```bash
npm run package
```

Το portable app θα δημιουργηθεί στο:
```
dist/Windows Sidebar By WebAlly-win32-x64/
```

Μέσα θα βρεις το `Windows Sidebar By WebAlly.exe` που μπορείς να τρέξεις απευθείας.

**Πλεονεκτήματα:**
- Δεν χρειάζεται εγκατάσταση
- Δεν χρειάζεται administrator privileges
- Portable - μπορείς να το μετακινήσεις όπου θέλεις
- Auto-startup λειτουργεί αυτόματα

### Μέθοδος 2: Installer Build (Advanced)

Αν θέλεις να δημιουργήσεις installer:

1. **Προετοιμασία**
   - Χρειάζεσαι administrator privileges
   - Προαιρετικά: Δημιούργησε ένα `icon.ico` (256x256 pixels)

2. **Build Command**
```bash
npm run build
```

**Σημείωση:** Αν αποτύχει λόγω code signing errors, χρησιμοποίησε την Μέθοδο 1.

### Πώς να κάνεις Build εσύ

1. **Clone το repository**
```bash
git clone https://github.com/past0101/sidebar-windows11.git
cd sidebar-windows11
```

2. **Εγκατάσταση dependencies**
```bash
npm install
```

3. **Τρέξε το app για testing**
```bash
npm start
```

4. **Build το portable exe**
```bash
npm run package
```

5. **Το exe βρίσκεται στο:**
```
dist/Windows Sidebar By WebAlly-win32-x64/Windows Sidebar By WebAlly.exe
```

### Χρήση του Portable App

1. Πήγαινε στο `dist/Windows Sidebar By WebAlly-win32-x64/`
2. Εκτέλεσε το `Windows Sidebar By WebAlly.exe`
3. Το app θα ξεκινήσει και θα ρυθμιστεί για auto-startup
4. Θα εμφανιστεί στο system tray (hidden icons)

### Troubleshooting

**Πρόβλημα: Icons δεν φορτώνουν**
- Τα Windows native icons φορτώνουν από .lnk shortcuts
- Σύρε shortcuts από το Start Menu ή Desktop
- Τα .exe files θα δείξουν το native icon τους

**Πρόβλημα: Build αποτυγχάνει**
- Χρησιμοποίησε `npm run package` αντί για `npm run build`
- Βεβαιώσου ότι έχεις Node.js v16 ή νεότερο

## Τεχνολογίες

- Electron - Desktop framework
- windows-shortcuts - .lnk file parsing
- HTML5/CSS3 - UI
- JavaScript - Application logic
- electron-builder - Packaging

## Σημειώσεις

- Η εφαρμογή χρησιμοποιεί localStorage για την αποθήκευση των συντομεύσεων
- Το παράθυρο είναι κεντραρισμένο κάθετα στη δεξιά άκρη
- Υποστηρίζει όλους τους τύπους αρχείων και φακέλων των Windows
- GPU process errors είναι φυσιολογικά και δεν επηρεάζουν τη λειτουργία

## License

MIT License

## Author

past0101

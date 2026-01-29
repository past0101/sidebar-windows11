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

### Προετοιμασία

1. Βεβαιώσου ότι έχεις ένα `icon.ico` αρχείο στο root folder
   - Μέγεθος: 256x256 pixels recommended
   - Format: .ico

2. Εγκατάσταση electron-builder (αν δεν έχει γίνει ήδη)
```bash
npm install --save-dev electron-builder
```

### Build Process

Εκτέλεσε την εντολή build:
```bash
npm run build
```

Το installer θα δημιουργηθεί στο folder `dist/`:
```
dist/
  └── Windows 11 Sidebar Setup.exe
```

### Τι περιλαμβάνει το Installer

- Αυτόματη εγκατάσταση στο Program Files
- Desktop shortcut
- Start Menu shortcut
- Auto-startup με τα Windows
- Uninstaller
- System tray integration

### Εγκατάσταση

1. Εκτέλεσε το `Windows 11 Sidebar Setup.exe`
2. Επίλεξε το installation directory (προαιρετικό)
3. Το app θα ξεκινήσει αυτόματα μετά την εγκατάσταση
4. Θα εμφανιστεί στο system tray (hidden icons)

### Απεγκατάσταση

- Μέσω Windows Settings > Apps > Installed Apps
- Ή μέσω Control Panel > Programs and Features

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

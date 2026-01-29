# Windows 11 Sidebar - Γρήγορες Συνδέσεις

Ένα σύγχρονο, διαφανές sidebar για Windows 11 με δυνατότητα drag-and-drop για γρήγορη πρόσβαση σε αρχεία, φακέλους και προγράμματα.

## Χαρακτηριστικά

- ✨ Σύγχρονο UI με glassmorphism effect
- 🎨 Διαφανές παράθυρο με blur effect
- 📌 Πάντα στο προσκήνιο (always on top)
- 🖱️ Drag & Drop λειτουργικότητα

[Features](#features) • [Installation](#installation) • [Usage](#usage) • [Building](#building)

</div>

---

## ✨ Features

### 🎨 **Modern Design**
- **Ultra-transparent** glassmorphism με 60px blur effect
- **Gradient overlay** με ωραία χρώματα (μπλε, μωβ, ροζ)
- **Rounded corners** (20px border-radius)
- **Smooth animations** με cubic-bezier transitions
- **60px width** - εξαιρετικά διακριτικό

### 🖼️ **Windows Native Icons**
- Διαβάζει **πραγματικά Windows icons** από shortcuts (.lnk files)
- Υποστηρίζει όλους τους τύπους αρχείων (.exe, .lnk, folders, κλπ)
- **Icon caching** για γρήγορη φόρτωση
- Resolves shortcut targets αυτόματα

### 💬 **Smart Tooltips**
- Εμφανίζονται **εκτός του sidebar** στα αριστερά
- Δείχνουν το **καθαρό όνομα** της εφαρμογής (χωρίς .lnk)
- **Smooth fade** in/out animation
- Αυτόματη απόκρυψη

### 🎯 **Functionality**
- **Drag & Drop** - Σύρε shortcuts από οπουδήποτε
- **Right-click** για διαγραφή
- **localStorage** persistence - Αποθηκεύει τις συντομεύσεις σου
- **Κεντραρισμένο κάθετα** στη δεξιά άκρη της οθόνης
- **Δυναμικό ύψος** - Προσαρμόζεται στα icons
- **System tray icon** - Τρέχει στα hidden icons
- **Auto-startup** - Ξεκινάει αυτόματα με τα Windows

---

## 📦 Installation

### Prerequisites
- Windows 11
- Node.js (v16 or higher)
- npm

### Steps

1. **Clone the repository**
```bash
git clone https://github.com/past0101/sidebar-windows11.git
cd sidebar-windows11
```

2. **Install dependencies**
```bash
npm install
```

3. **Run the application**
```bash
npm start
```

---

## 🚀 Usage

### Adding Shortcuts
1. Σύρε οποιοδήποτε αρχείο, φάκελο ή shortcut στο sidebar
2. Το icon θα εμφανιστεί αυτόματα με το native Windows icon
3. Hover πάνω από το icon για να δεις το όνομα

Για να δημιουργήσετε εκτελέσιμο αρχείο:

```powershell
npm run build
```

Το εκτελέσιμο θα βρίσκεται στον φάκελο `dist/`.

## Τεχνολογίες

- Electron - Desktop framework
- HTML5/CSS3 - UI
- JavaScript - Λογική εφαρμογής
- Node.js - Backend

## Σημειώσεις

- Η εφαρμογή χρησιμοποιεί localStorage για την αποθήκευση των συντομεύσεων
- Το παράθυρο είναι πάντα στο προσκήνιο και δεν εμφανίζεται στην taskbar
- Υποστηρίζει όλους τους τύπους αρχείων και φακέλων των Windows

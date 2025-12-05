🧾 React Invoice Generator

This is a modern, single-page application built with React and Vite for quickly generating professional, customizable invoices. It leverages Material-UI for robust components and Tailwind CSS for rapid, utility-first styling.

✨ Features

Dynamic Item Management: Easily add, edit, and remove line items with automatic numbering.

Real-time Calculation: Instantly calculates subtotals, taxes, discounts, and grand totals as you type.

Customizable Fields: Supports input fields for company/client details, invoice number, issue date, and due date.

Tax & Discount Handling: Dedicated fields for entering VAT, sales tax, or percentage/fixed discounts.

Print and Export: Dedicated "Print" functionality optimized for clean, professional PDF export (print-friendly CSS applied).

Responsive Design: Optimized for use on desktop and tablet devices.

🛠️ Tech Stack

Framework: React

Build Tool: Vite

Styling & Utilities: Tailwind CSS

UI Components: Material-UI (MUI)

Language: JavaScript/TypeScript (assuming)

🚀 Prerequisites

Before you begin, ensure you have the following installed on your system:

Node.js (LTS recommended)

npm (usually comes with Node.js) or Yarn

⚙️ Installation and Setup

Follow these steps to get a development environment running:

Clone the Repository:

git clone [YOUR_REPO_URL]
cd react-invoice-generator


Install Dependencies:

npm install
# or
yarn install


Start the Development Server:

npm run dev
# or
yarn dev


The application should now be running locally, typically accessible at http://localhost:5173.

🖥️ Usage

Input Details: Fill in the company information, client details, and invoice metadata (number, dates).

Add Items: Use the "Add Item" button to create new rows for goods or services. Enter the description, quantity, and unit price. The totals will update automatically.

Configure Totals: Adjust the Tax Rate and Discount fields as needed.

Print/Export: Click the Print button (or similar export icon). Your browser's print dialog will open, allowing you to either print the invoice or save it as a PDF document.

🎨 Styling Notes

This project uses a hybrid styling approach:

Material-UI is used for core components (Buttons, TextFields, Data Grid, etc.) to ensure accessibility and consistent behavior.

Tailwind CSS utility classes are applied directly to components and wrappers for fast, granular control over layout, spacing, colors, and responsive breakpoints.
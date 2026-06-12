# T-42-03 — Komponent CrmFileUploadPanel

**Story:** [US-42](../story.md)  
**Status:** Done  
**Zależy od:** [T-42-02](./T-42-02-file-types-and-context.md)

## Cel

Wspólny panel uploadu oparty o Dice UI File Upload z symulacją progress.

## Zakres

### `components/crm/crm-file-upload-panel.tsx`

- Składnia: `FileUpload`, `FileUploadDropzone`, `FileUploadList`, `FileUploadItem`, …
- Props: `files`, `onUpload(file: File)`, `onRemove?(id)`, `disabled?`.
- `onUpload` na root: opóźnienie demo ~300–800 ms, progress z API komponentu.
- Walidacja `onFileValidate`: max 10 plików, max 5 MB, typy PDF/obrazy/Office — komunikat PL.
- Usunąć / zdeprecjonować `CompanyFilesUploadZone` po migracji.

## Done when

- [x] Panel działa izolowanie (storybook/manual) z listą plików i progressem.
- [x] Odrzucenie pliku pokazuje komunikat PL.

## Poza zakresem

- Podpięcie do trzech paneli (→ T-42-04).

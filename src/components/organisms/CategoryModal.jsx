import { useState } from 'react';
import { Modal } from '../atoms/Modal';
import { FormField } from '../molecules/FormField';
import { Textarea } from '../atoms/Textarea';
import { Label } from '../atoms/Label';
import { ErrorText } from '../atoms/ErrorText';
import { Button } from '../atoms/Button';
import { Alert } from '../atoms/Alert';
import { ApiError } from '../../services/api';

export function CategoryModal({
  isOpen = false,
  onClose,
  onSubmit,
  category = null,
  isLoading = false,
}) {
  const isEdit = Boolean(category?.id);
  const [formData, setFormData] = useState({
    name: category?.name || '',
    description: category?.description || '',
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState('');

  const [prevCategory, setPrevCategory] = useState(category);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  if (prevCategory !== category || prevIsOpen !== isOpen) {
    setPrevCategory(category);
    setPrevIsOpen(isOpen);
    setFormData({
      name: category?.name || '',
      description: category?.description || '',
    });
    setFieldErrors({});
    setGeneralError('');
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (generalError) {
      setGeneralError('');
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = 'Nama kategori wajib diisi.';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Nama kategori minimal 2 karakter.';
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');
    setFieldErrors({});

    const clientErrors = validateForm();
    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors(clientErrors);
      return;
    }

    try {
      await onSubmit({
        name: formData.name.trim(),
        description: formData.description.trim(),
      });
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.fields && Object.keys(err.fields).length > 0) {
          const mappedErrors = {};
          for (const key in err.fields) {
            mappedErrors[key] = Array.isArray(err.fields[key])
              ? err.fields[key][0]
              : err.fields[key];
          }
          setFieldErrors(mappedErrors);
        }
        const displayError =
          err.fields?.non_field_errors?.[0] ||
          err.fields?.name?.[0] ||
          err.message ||
          'Gagal menyimpan kategori.';
        setGeneralError(displayError);
      } else {
        setGeneralError('Terjadi kesalahan jaringan. Silakan coba lagi.');
      }
    }
  };

  const footer = (
    <>
      <Button
        variant="secondary"
        fullWidth={false}
        onClick={onClose}
        disabled={isLoading}
      >
        Batal
      </Button>
      <Button
        type="submit"
        form="categoryForm"
        variant="primary"
        fullWidth={false}
        isLoading={isLoading}
      >
        {isEdit ? 'Perbarui' : 'Simpan'}
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Kategori' : 'Tambah Kategori Baru'}
      footer={footer}
      maxWidth="max-w-md"
    >
      <form id="categoryForm" onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        {generalError && <Alert type="error" message={generalError} />}

        {/* Input: Nama Kategori */}
        <FormField
          label="Nama Kategori"
          id="categoryName"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Contoh: Espresso Based, Pastry"
          error={fieldErrors.name}
          required
          disabled={isLoading}
        />

        {/* Input: Deskripsi */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="categoryDescription">
            Deskripsi (Opsional)
          </Label>
          <Textarea
            id="categoryDescription"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Keterangan singkat mengenai kategori ini..."
            rows={3}
            isError={!!fieldErrors.description}
            disabled={isLoading}
          />
          {fieldErrors.description && (
            <ErrorText>{fieldErrors.description}</ErrorText>
          )}
        </div>
      </form>
    </Modal>
  );
}

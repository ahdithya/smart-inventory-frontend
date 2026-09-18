import { useState } from 'react';
import { Modal } from '../atoms/Modal';
import { FormField } from '../molecules/FormField';
import { Select } from '../atoms/Select';
import { Label } from '../atoms/Label';
import { ErrorText } from '../atoms/ErrorText';
import { Button } from '../atoms/Button';
import { Alert } from '../atoms/Alert';
import { ApiError } from '../../services/api';

const DEFAULT_UNITS = [
  'Pcs',
  'Cup',
  'Kg',
  'Gram',
  'Liter',
  'Box',
  'Karton',
  'Botol',
  'Pack',
];

export function ProductModal({
  isOpen = false,
  onClose,
  onSubmit,
  product = null,
  categories = [],
  isLoading = false,
}) {
  const isEdit = Boolean(product?.id);

  const initialValues = {
    name: product?.name || '',
    sku: product?.sku || '',
    category: product?.category ? String(product.category) : '',
    unit: product?.unit || 'Pcs',
    purchase_price: product?.purchase_price !== undefined ? String(product.purchase_price) : '',
    selling_price: product?.selling_price !== undefined ? String(product.selling_price) : '',
    min_stock: product?.min_stock !== undefined ? String(product.min_stock) : '10',
    safety_stock: product?.safety_stock !== undefined ? String(product.safety_stock) : '5',
    lead_time_days: product?.lead_time_days !== undefined ? String(product.lead_time_days) : '7',
    expiry_days: product?.expiry_days !== null && product?.expiry_days !== undefined ? String(product.expiry_days) : '',
  };

  const [formData, setFormData] = useState(initialValues);
  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState('');

  const [prevProduct, setPrevProduct] = useState(product);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  if (prevProduct !== product || prevIsOpen !== isOpen) {
    setPrevProduct(product);
    setPrevIsOpen(isOpen);
    setFormData(initialValues);
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
      errors.name = 'Nama produk wajib diisi.';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Nama produk minimal 2 karakter.';
    }

    if (!formData.category) {
      errors.category = 'Pilih salah satu kategori produk.';
    }

    if (!formData.unit.trim()) {
      errors.unit = 'Satuan produk wajib ditentukan.';
    }

    if (formData.purchase_price === '' || Number(formData.purchase_price) < 0) {
      errors.purchase_price = 'Harga modal wajib diisi dan tidak boleh minus.';
    }

    if (formData.selling_price === '' || Number(formData.selling_price) < 0) {
      errors.selling_price = 'Harga jual wajib diisi dan tidak boleh minus.';
    }

    if (formData.min_stock === '' || Number(formData.min_stock) < 0) {
      errors.min_stock = 'Stok minimum tidak boleh bernilai negatif.';
    }

    if (formData.safety_stock === '' || Number(formData.safety_stock) < 0) {
      errors.safety_stock = 'Safety stock tidak boleh bernilai negatif.';
    }

    if (formData.lead_time_days === '' || Number(formData.lead_time_days) < 1) {
      errors.lead_time_days = 'Lead time minimal 1 hari.';
    }

    if (formData.expiry_days !== '' && Number(formData.expiry_days) < 0) {
      errors.expiry_days = 'Masa simpan tidak boleh bernilai negatif.';
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    const payload = {
      name: formData.name.trim(),
      category: Number(formData.category),
      unit: formData.unit.trim(),
      purchase_price: parseFloat(formData.purchase_price) || 0,
      selling_price: parseFloat(formData.selling_price) || 0,
      min_stock: parseInt(formData.min_stock, 10) || 0,
      safety_stock: parseInt(formData.safety_stock, 10) || 0,
      lead_time_days: parseInt(formData.lead_time_days, 10) || 7,
      expiry_days: formData.expiry_days !== '' ? parseInt(formData.expiry_days, 10) : null,
    };

    if (formData.sku.trim()) {
      payload.sku = formData.sku.trim().toUpperCase();
    } else if (!isEdit) {
      // If adding new without SKU, backend will auto-generate
      payload.sku = '';
    }

    try {
      await onSubmit(payload, product?.id);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.fields && Object.keys(err.fields).length > 0) {
          const mapped = {};
          Object.entries(err.fields).forEach(([k, v]) => {
            mapped[k] = Array.isArray(v) ? v[0] : String(v);
          });
          setFieldErrors(mapped);
        } else {
          setGeneralError(err.message || 'Gagal menyimpan produk.');
        }
      } else {
        setGeneralError('Terjadi kesalahan yang tidak terduga.');
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Data Produk' : 'Tambah Produk Baru'}
      maxWidth="max-w-[760px]"
    >
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        {generalError && (
          <Alert type="error" message={generalError} />
        )}

        {isEdit && product?.current_stock !== undefined && (
          <div className="bg-[#f4f3f3] border border-[#e5e5e5] rounded-[6px] px-4 py-2.5 flex items-center justify-between text-[13px]">
            <span className="text-[#5f5e5e]">Stok Saat Ini (Read-Only):</span>
            <span className="font-semibold text-[#1a1c1c]">
              {product.current_stock} {product.unit}
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          {/* Kolom Kiri */}
          <div className="flex flex-col gap-4">
            {/* Nama Produk */}
            <FormField
              label="Nama Produk"
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Contoh: Kopi Susu Gula Aren"
              error={fieldErrors.name}
              disabled={isLoading}
            />

            {/* Kategori */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="category" required>
                Kategori
              </Label>
              <Select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                isError={!!fieldErrors.category}
                disabled={isLoading}
              >
                <option value="">-- Pilih Kategori --</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </Select>
              {fieldErrors.category && (
                <ErrorText>{fieldErrors.category}</ErrorText>
              )}
            </div>

            {/* Harga Modal */}
            <FormField
              label="Harga Modal (Rp)"
              id="purchase_price"
              name="purchase_price"
              type="number"
              min="0"
              step="1"
              required
              value={formData.purchase_price}
              onChange={handleChange}
              placeholder="0"
              error={fieldErrors.purchase_price}
              disabled={isLoading}
            />

            {/* Stok Minimum */}
            <FormField
              label="Stok Minimum"
              id="min_stock"
              name="min_stock"
              type="number"
              min="0"
              required
              value={formData.min_stock}
              onChange={handleChange}
              placeholder="10"
              helperText="Batas stok sebelum masuk status menipis"
              error={fieldErrors.min_stock}
              disabled={isLoading}
            />

            {/* Lead Time */}
            <FormField
              label="Lead Time (hari)"
              id="lead_time_days"
              name="lead_time_days"
              type="number"
              min="1"
              required
              value={formData.lead_time_days}
              onChange={handleChange}
              placeholder="7"
              helperText="Estimasi waktu kedatangan barang dari supplier"
              error={fieldErrors.lead_time_days}
              disabled={isLoading}
            />
          </div>

          {/* Kolom Kanan */}
          <div className="flex flex-col gap-4">
            {/* SKU */}
            <FormField
              label="SKU / Kode Produk"
              id="sku"
              name="sku"
              type="text"
              value={formData.sku}
              onChange={handleChange}
              placeholder="Kosongkan untuk auto-generate"
              helperText={isEdit ? undefined : 'Otomatis di-generate jika dikosongkan'}
              error={fieldErrors.sku}
              disabled={isLoading}
            />

            {/* Satuan */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="unit" required>
                Satuan
              </Label>
              <Select
                id="unit"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                isError={!!fieldErrors.unit}
                disabled={isLoading}
              >
                {DEFAULT_UNITS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </Select>
              {fieldErrors.unit && <ErrorText>{fieldErrors.unit}</ErrorText>}
            </div>

            {/* Harga Jual */}
            <FormField
              label="Harga Jual (Rp)"
              id="selling_price"
              name="selling_price"
              type="number"
              min="0"
              step="1"
              required
              value={formData.selling_price}
              onChange={handleChange}
              placeholder="0"
              error={fieldErrors.selling_price}
              disabled={isLoading}
            />

            {/* Safety Stock */}
            <FormField
              label="Safety Stock"
              id="safety_stock"
              name="safety_stock"
              type="number"
              min="0"
              required
              value={formData.safety_stock}
              onChange={handleChange}
              placeholder="5"
              helperText="Stok cadangan pengaman lonjakan permintaan"
              error={fieldErrors.safety_stock}
              disabled={isLoading}
            />

            {/* Masa Simpan (Expiry Days) */}
            <FormField
              label="Masa Simpan (hari)"
              id="expiry_days"
              name="expiry_days"
              type="number"
              min="0"
              value={formData.expiry_days}
              onChange={handleChange}
              placeholder="Kosongkan jika non-makanan"
              helperText="Opsional untuk bahan/makanan mudah basi"
              error={fieldErrors.expiry_days}
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#e5e5e5]">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            Batal
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
          >
            {isEdit ? 'Simpan Perubahan' : 'Simpan Produk'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

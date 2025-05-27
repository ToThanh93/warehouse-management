import React, { useState } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';

const UploadCSVForm = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [isUploading, setUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Vui lòng chọn file CSV!");

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/upload-csv/", {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Tải lên thất bại");

      setMessage(`✅ Tải lên thành công: ${data.rows_imported || data.rows || 0} dòng`);
    } catch (err) {
      setMessage(`❌ Lỗi: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mt-5">
      <h5>📤 Upload CSV File</h5>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formFile">
          <Form.Control
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </Form.Group>
        <Button type="submit" variant="primary" className="mt-2" disabled={isUploading}>
          {isUploading ? <Spinner size="sm" animation="border" /> : 'Upload'}
        </Button>
      </Form>

      {message && <Alert variant="info" className="mt-3">{message}</Alert>}
    </div>
  );
};

export default UploadCSVForm;

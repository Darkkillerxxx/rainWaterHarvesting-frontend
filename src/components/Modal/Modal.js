import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Image } from 'react-bootstrap';

const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const month = `${d.getMonth() + 1}`.padStart(2, '0'); // Ensure 2 digits
    const day = `${d.getDate()}`.padStart(2, '0'); // Ensure 2 digits
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  };
  
  const MyModal = ({ picklistOptions, rowData, triggerModalVisibility }) => {
    const [show, setShow] = useState(true);
  
    // Initialize formData with selectedData (default values)
    const [formData, setFormData] = useState({
      district: '',
      taluka: '',
      village: '',
      location: '',
      inaugurationDate: '',
      inaugurationPhoto: null,
      inaugurationPhotoBase64: '', // For storing the base64 string
      completionDate: '',
      completionPhoto: null,
      completionPhotoBase64: '', // For storing the base64 string
    });
  
    const [picklistValues, setPicklistValues] = useState({
      district: [],
      taluka: [],
      village: [],
    });
  
    const handleClose = () => {
        setShow(false)
        triggerModalVisibility();
    };
    const handleShow = () => setShow(true);

    // Helper to convert file to base64
    const convertToBase64 = (file, name) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setFormData(prevState => ({
          ...prevState,
          [name]: file, // Store the file
          [`${name}Base64`]: reader.result, // Store base64 string
        }));
      };
    };
  
    const handleChange = (e) => {
      const { name, value, files } = e.target;
      if (files && files.length > 0) {
        convertToBase64(files[0], name); // Convert the file to base64
      } else {
        setFormData({ ...formData, [name]: value });
      }
    };
  
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Map formData fields to match your database columns
        const mappedData = {
          ID:rowData.id,
          DISTRICT: formData.district,
          TALUKA: formData.taluka,
          VILLAGE: formData.village,
          LOCATION: formData.location,
          Inauguration_DATE: formData.inaugurationDate,
          inaugurationPhotoBase64: formData.inaugurationPhotoBase64, // base64 encoded image
          COMPLETED_DATE: formData.completionDate,
          completionPhotoBase64: formData.completionPhotoBase64, // base64 encoded image
        };
      
        console.log(mappedData);
      
        // Send the mappedData to your backend API
        fetch('https://rainwaterharvesting-backend.onrender.com/updateRecords', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(mappedData),
        })
          .then((response) => response.json())
          .then((data) => {
            alert('Records Update Successfull');
          })
          .catch((error) => {
            alert('Update Error:', error);
          });
      
        handleClose();
      };
  
    useEffect(() => {
      // Populate picklist values from props
      setPicklistValues({ ...picklistOptions });
  
      // Populate formData with selectedData, format the dates properly
      console.log(rowData);
      setFormData({
        district: rowData.district || '',
        taluka: rowData.taluka || '',
        village: rowData.village || '',
        location: rowData.location || '',
        inaugurationDate: formatDate(rowData.inaugurationDate), // Format date
        inaugurationPhoto: rowData.inaugurationPhoto || null,
        completionDate: formatDate(rowData.completionDate), // Format date
        completionPhoto: rowData.completionPhoto || null,
      });
    }, [picklistOptions, rowData]);

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            {/* District Picklist */}
            <Form.Group controlId="district" style={{ marginBottom: 10 }}>
              <Form.Label>District</Form.Label>
              <Form.Control
                as="select"
                name="district"
                value={formData.district} // Set the value to selected data
                onChange={handleChange}
              >
                <option value="">Select District</option>
                {picklistValues.district.map((district, index) => (
                  <option key={index} value={district}>
                    {district}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            {/* Taluka Picklist */}
            <Form.Group controlId="taluka" style={{ marginBottom: 10 }}>
              <Form.Label>Taluka</Form.Label>
              <Form.Control
                as="select"
                name="taluka"
                value={formData.taluka} // Set the value to selected data
                onChange={handleChange}
              >
                <option value="">Select Taluka</option>
                {picklistValues.taluka.map((taluka, index) => (
                  <option key={index} value={taluka}>
                    {taluka}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            {/* Village Picklist */}
            <Form.Group controlId="village" style={{ marginBottom: 10 }}>
              <Form.Label>Village</Form.Label>
              <Form.Control
                as="select"
                name="village"
                value={formData.village} // Set the value to selected data
                onChange={handleChange}
              >
                <option value="">Select Village</option>
                {picklistValues.village.map((village, index) => (
                  <option key={index} value={village}>
                    {village}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            {/* Location TextArea */}
            <Form.Group controlId="location" style={{ marginBottom: 10 }}>
              <Form.Label>Location</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="location"
                value={formData.location} // Set the value to selected data
                onChange={handleChange}
              />
            </Form.Group>

            {/* Inauguration Date */}
            <Form.Group controlId="inaugurationDate" style={{ marginBottom: 10 }}>
              <Form.Label>Inauguration Date</Form.Label>
              <Form.Control
                type="date"
                name="inaugurationDate"
                value={formData.inaugurationDate} // Set the value to selected data
                onChange={handleChange}
              />
            </Form.Group>

            {/* Inauguration Photo */}
            <Form.Group controlId="inaugurationPhoto" style={{ marginBottom: 10 }}>
              <Form.Label>Inauguration Photo</Form.Label>
              <Form.Control
                type="file"
                name="inaugurationPhoto"
                onChange={handleChange}
              />
              {/* Show the image if base64 is available */}
              {formData.inaugurationPhotoBase64 && (
                <Image
                  src={formData.inaugurationPhotoBase64}
                  alt="Inauguration Preview"
                  thumbnail
                  style={{ marginTop: 10 }}
                />
              )}
            </Form.Group>

            {/* Completion Date */}
            <Form.Group controlId="completionDate" style={{ marginBottom: 10 }}>
              <Form.Label>Completion Date</Form.Label>
              <Form.Control
                type="date"
                name="completionDate"
                value={formData.completionDate} // Set the value to selected data
                onChange={handleChange}
              />
            </Form.Group>

            {/* Completion Photo */}
            <Form.Group controlId="completionPhoto" style={{ marginBottom: 10 }}>
              <Form.Label>Completion Photo</Form.Label>
              <Form.Control type="file" name="completionPhoto" onChange={handleChange} />
              {/* Show the image if base64 is available */}
              {formData.completionPhotoBase64 && (
                <Image
                  src={formData.completionPhotoBase64}
                  alt="Completion Preview"
                  thumbnail
                  style={{ marginTop: 10 }}
                />
              )}
            </Form.Group>

            {/* Submit Button */}
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default MyModal;

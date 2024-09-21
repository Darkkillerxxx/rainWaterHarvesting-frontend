import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Image } from 'react-bootstrap';

  
const ImageModal = ({selectedImage, onHandleClose }) => {
  const [show, setShow] = useState(true);

  

  return(
    <Modal show={show} size="md" centered>
      <Modal.Body>
        <div className="col-12" style={{ height: 500, position: 'relative' }}>
          {selectedImage && (
            <Image
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                position: 'absolute', // Ensures it takes up the full space
                top: 0,
                left: 0
              }}
              src={selectedImage}
              alt="Selected Preview"
              fluid
            />
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => onHandleClose()}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  
    )  
  }


export default ImageModal;

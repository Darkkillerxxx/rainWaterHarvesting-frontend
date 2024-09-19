import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Image } from 'react-bootstrap';

  
const ImageModal = ({selectedImage, onHandleClose }) => {
  const [show, setShow] = useState(true);

  

  return(
      <Modal show={show} size="md" centered>
        <Modal.Body>
          {selectedImage && (
            <Image style={{objectFit:'cover'}} src={selectedImage} alt="Selected Preview" fluid />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={()=>onHandleClose()}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    )  
  }


export default ImageModal;

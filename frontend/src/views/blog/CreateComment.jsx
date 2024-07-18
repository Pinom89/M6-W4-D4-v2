import React from 'react'
import { Button, Modal , Form, InputGroup} from 'react-bootstrap';
export default function CreateComment({setNewComment, show, handleClose, createComment, newComment, handleInputChange}) {
 


  return (
    <>
      <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton >
        <Modal.Title>  <h3>Crea commento</h3> </Modal.Title>
      </Modal.Header>
      <Modal.Body> 
      <Form onSubmit={createComment}>
               <InputGroup className="mb-3 mt-5">
                  <Form.Control
                    name="name"
                    placeholder="Nome"
                    aria-label="Nome"
                    aria-describedby="basic-addon1"
                    type='text' 
                    required
                    value={newComment.name}
                    onChange={handleInputChange}
                  />
                </InputGroup>
  
                <InputGroup className="mb-3">
                    <Form.Control
                    name="email"
                    placeholder="Email"
                    aria-label="Email"
                    aria-describedby="basic-addon2"
                    type='text'
                    required
                    value={newComment.email}
                    onChange={handleInputChange}
                  />
                </InputGroup>

                <InputGroup className="mb-3">
                    <Form.Control
                    name="comment"
                    placeholder="Inserisci il tuo commento"
                    aria-label="Email"
                    aria-describedby="basic-addon2"
                    type='text'
                    required
                    value={newComment.comment}
                    as={"textarea"}
                    onChange={handleInputChange}
                  />
                </InputGroup>
                 <div className="d-flex justify-content-center align-items-center gap-2 ">
                    <Button 
                      size="md"
                      variant="dark"
                      type="submit" 
                      className='ms-3' >
                        Salva Modifica
                    </Button>
                    <Button
                      variant="outline-dark"
                      onClick={() => handleClose()}
                      className='mx-1'
                      size='md'>
                        Annulla
                    </Button>
                    <Button 
                      size="md"
                      variant="dark"
                      onClick={() => setNewComment(
                        {name: '', email: '', comment: ''})}
                        className='ms-3' >
                        Reset dati 
                     </Button>
                  </div>
              </Form>
      </Modal.Body>
    </Modal>
  </>
  )
}






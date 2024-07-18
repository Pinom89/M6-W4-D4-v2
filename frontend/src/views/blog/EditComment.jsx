import React from 'react'
import { Button, Modal, Form, InputGroup } from 'react-bootstrap';

export default function EditComment({editShow, handleEditClose, updateComment , editComment, handleEditInputChange, setEditComment}) {
  console.log(editComment)
    return (
    <> 
   

    <Modal show={editShow} onHide={handleEditClose}>
    <Modal.Header closeButton >
      <Modal.Title>  <h3> Modifica commento</h3> </Modal.Title>
    </Modal.Header>
    <Modal.Body> 
    <Form onSubmit={updateComment}>
               <InputGroup className="mb-3 mt-5">
                  <Form.Control
                    name="name"
                    placeholder="Nome"
                    aria-label="Nome"
                    aria-describedby="basic-addon1"
                    type='text' 
                    required
                    value={editComment.name}
                    onChange={handleEditInputChange}
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
                    value={editComment.email}
                    onChange={handleEditInputChange}
                  />
                </InputGroup>

                <InputGroup className="mb-3">
                    <Form.Control
                    name="comment"
                    placeholder="Modifica il commento"
                    aria-label="Email"
                    aria-describedby="basic-addon2"
                    type='text'
                    required
                    value={editComment.comment}
                    as={"textarea"}
                    onChange={handleEditInputChange}
                  />
                </InputGroup>
                 <div className="d-flex justify-content-center align-items-center gap-2 ">
                    <Button 
                      size="md"
                      variant="dark"
                      type="submit" 
                      className='ms-3' >
                       Conferma modifica
                    </Button>
                    <Button
                      variant="outline-dark"
                      onClick={() => setEditComment({name: "", email: "", comment: ""})}
                      className='mx-1'
                      size='md'>
                        Annulla
                    </Button>
                  </div>
              </Form>
    </Modal.Body>
  </Modal>
  </>
  )
}

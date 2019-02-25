import './Table.css';

import React from 'react';
import ReactDOM from 'react-dom';

import { signUp, logIn, getPets, addPet, removePets, updatePet } from '../AJAX.js';

export default class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      petsRows: [],
    }
  }

  componentDidMount() {
    let rowId;

    let onAddPetButton = () => {
      let formData = new FormData();
      formData.append('petName', document.getElementById('petName').value);
      formData.append('petAge', document.getElementById('petAge').value);
      formData.append('petType', document.getElementById('petType').value);

      addPet(formData);
    }

    let onRemovePetsButton = () => {
      let formData = new FormData();
      formData.append('petsNames', document.getElementById('petsNames').value);

      removePets(formData);
    }

    let onUpdatePetButton = () => {
      let formData = new FormData();
      formData.append('petNameUp', document.getElementById('petNameUp').value);
      formData.append('petAgeUp', document.getElementById('petAgeUp').value);
      formData.append('petTypeUp', document.getElementById('petTypeUp').value);
      formData.append('id', rowId);

      updatePet(formData);
    }

    getPets(this, localStorage.Token);

    document.getElementById('addPetButton').addEventListener('click', (e) => { e.preventDefault(); onAddPetButton(); $('#addPetModal').modal('toggle') })
    document.getElementById('removePetsButton').addEventListener('click', (e) => { e.preventDefault(); onRemovePetsButton(); $('#removePetModal').modal('toggle') })
    document.getElementById('mainTable').querySelector('tbody').addEventListener('click', (e) => {
      rowId = +e.target.parentNode.id.slice(3);
      $('#updatePetModal').modal('toggle');
    })
    document.getElementById('updatePetButton').addEventListener('click', (e) => { e.preventDefault(); onUpdatePetButton(); $('#updatePetModal').modal('toggle') })

    //marker rows that match input query
    document.getElementById('findPet').addEventListener('input', (e) => {
      let v = e.target.value;
      let tds = document.getElementById('mainTable').querySelectorAll('tbody>tr>td:first-child');
      tds.forEach((el) => {
        if (v != '' && el.innerText.includes(v)) { el.parentNode.classList.add('marker') } else { el.parentNode.classList.remove('marker') }
      })
    })

  }

  render() {
    let petsTrs = this.state.petsRows.map((v) =>
      <tr id={'row' + v.id}>
        <td>{v.name}</td>
        <td>{v.type}</td>
        <td>{v.age}</td>
      </tr>
    )

    return (
      <div className='table-responsive'>
        <table className='table table-bordered table-bordered table-hover' id='mainTable'>

          <thead>
            <tr>
              <td>name</td>
              <td>type</td>
              <td>age</td>
            </tr>
          </thead>

          <tfoot>
            <tr>
              <td colSpan='3'>
                <input type='text' id='findPet' placeholder='start typing to find a pet' />
                <br />

                <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#addPetModal">
                  Add a pet
                </button>

                <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#removePetModal">
                  Remove pets
                </button>

                <div class="modal fade" id="addPetModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                  <div class="modal-dialog" role="document">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Add a pet</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div class="modal-body">
                        <form className='addPetForm' name='addPetForm'>
                          <div className='container-fluid'>
                            <div className="row">
                              <div className="col-12">
                                <input type='text' id='petName' placeholder=' pet name' required='required' />
                              </div>
                              <div className="col-12">
                                <input type='text' id='petAge' placeholder=' pet age' required='required' />
                              </div>
                              <div className="col-12">
                                <input type='text' id='petType' placeholder=' pet type' required='required' />
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                      <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" id="addPetButton" >Ok</button>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="modal fade" id="removePetModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                  <div class="modal-dialog" role="document">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Remove pets</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div class="modal-body">
                        <form className='removePetForm' name='removePetForm'>
                          <div className='container-fluid'>
                            <div className="row">
                              <div className="col-12">
                                <input type='text' id='petsNames' placeholder=' pets names' required='required' />
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                      <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" id="removePetsButton">Ok</button>
                      </div>
                    </div>
                  </div>
                </div>

              </td>
            </tr>
          </tfoot>

          <tbody>
            {petsTrs}
          </tbody>

        </table>
        {/* Modal for updating pet. toggle on click on table row */}
        <div class="modal fade" id="updatePetModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Update pet's info</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <form className='updatePetForm' name='updatePetForm'>
                  <div className='container-fluid'>
                    <div className="row">
                      <div className="col-12">
                        <input type='text' id='petNameUp' placeholder=' pet name' required='required' />
                      </div>
                      <div className="col-12">
                        <input type='text' id='petAgeUp' placeholder=' pet age' required='required' />
                      </div>
                      <div className="col-12">
                        <input type='text' id='petTypeUp' placeholder=' pet type' required='required' />
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" id="updatePetButton">Ok</button>
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }
}




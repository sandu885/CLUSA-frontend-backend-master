/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import { MDBContainer, MDBTableBody, MDBTableHead, MDBTable, MDBCardBody, MDBInput, MDBBtn, MDBModalFooter, MDBModal, MDBModalHeader, MDBModalBody } from 'mdbreact';
import axios from 'axios';

import './UserOrganizationManagement.css';

import FooterComponent from '../Footer';
import HeaderComponent from '../Header';

class UserOrganizationManagement extends Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }



  render() {

    const data_minimal_width = {
      columns: [
        {
          label: '#',
          field: 'id',
          sort: 'asc',
          minimal: 'sm'
        },
        {
          label: 'Lorem ipsum dolor',
          field: 'lorem ipsum dolor',
          sort: 'asc',
          minimal: 'lg'
        },
        {
          label: 'Lorem ipsum dolor',
          field: 'lorem ipsum',
          sort: 'asc',
          minimal: 'sm'
        },
        {
          label: 'Lorem ipsum dolor',
          field: 'lorem ',
          sort: 'asc',
          minimal: 'lg'
        }
      ],
      rows: [
        {
          'id': '1',
          'lorem ipsum dolor': 'Lorem ipsum dolor',
          'lorem ipsum': 'Lorem ipsum dolor',
          'lorem': 'Lorem ipsum dolor'
        },
        {
          'id': '2',
          'lorem ipsum dolor': 'Lorem ipsum dolor',
          'lorem ipsum': 'Lorem ipsum dolor',
          'lorem': 'Lorem ipsum dolor'
        },
        {
          'id': '3',
          'lorem ipsum dolor': 'Lorem ipsum dolor',
          'lorem ipsum': 'Lorem ipsum dolor',
          'lorem': 'Lorem ipsum dolor'
        }
      ]
    };



    return (
      <div className="bg-withImage">
        <HeaderComponent />
        <MDBContainer className="pb-3 mb-2 mt-2">
          <strong>User Management</strong>



          <MDBTable
            striped
            bordered
            small
            paging={true}
            data={data_minimal_width}
          >
            <MDBTableHead columns={data_minimal_width.columns}/>
            <MDBTableBody rows={data_minimal_width.rows} />
          </MDBTable>


        </MDBContainer>
        <br />

        <FooterComponent className="mt-5 pt-5" />
      </div>
    );
  }
}

export default UserOrganizationManagement;

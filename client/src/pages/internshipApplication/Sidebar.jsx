import { NavLink } from 'react-router-dom';
import React from 'react';
import {
  MDBCard,
  MDBCardBody,
} from 'mdbreact';

import './sidebar.css';

const Sidebar = () => (

  <div className="sidebar text-left">
    <MDBCard>
      <MDBCardBody className="mx-4">
        <h6 className="greyBG pt-2 pb-2 pl-2">PART A: Program Information</h6>
        <NavLink
          to="/internship-application-section01"
          activeStyle={{ width: '100%', color: 'black', background: ' rgb(180, 228, 255)' }}
        >1. Program Overview
        </NavLink>
        <br />
        <NavLink
          to="/internship-application-section02"
          activeStyle={{ width: '100%', color: 'black', background: ' rgb(180, 228, 255)' }}
        >2. Grant Goals
        </NavLink>
        <br />
        <NavLink
          to="/internship-application-section03"
          activeStyle={{ width: '100%', color: 'black', background: ' rgb(180, 228, 255)' }}
        >3. Leaders Team
        </NavLink>
        <br />
        <NavLink
          to="/internship-application-section04"
          activeStyle={{ width: '100%', color: 'black', background: ' rgb(180, 228, 255)' }}
        >4. Program Schedule
        </NavLink>
        <br />
        <NavLink
          to="/internship-application-section05"
          activeStyle={{ width: '100%', color: 'black', background: ' rgb(180, 228, 255)' }}
        >5. Internship Placement
        </NavLink>
        <br />
        <NavLink
          to="/internship-application-section06"
          activeStyle={{ width: '100%', color: 'black', background: ' rgb(180, 228, 255)' }}
        >6. Student Recruiting Plan
        </NavLink>
        <br />
        <NavLink
          to="/internship-application-section07"
          activeStyle={{ width: '100%', color: 'black', background: ' rgb(180, 228, 255)' }}
        >7. Student Training Plan
        </NavLink>
        <br />
        <NavLink
          to="/internship-application-section08"
          activeStyle={{ width: '100%', color: 'black', background: ' rgb(180, 228, 255)' }}
        >8. Graduation Ceremony Plan
        </NavLink>
        <br />
        <NavLink
          to="/internship-application-section09"
          activeStyle={{ width: '100%', color: 'black', background: ' rgb(180, 228, 255)' }}
        >9. Other Events Related
        </NavLink>
        <br />
        <NavLink
          to="/internship-application-section10"
          activeStyle={{ width: '100%', color: 'black', background: ' rgb(180, 228, 255)' }}
        >10. Program Budget
        </NavLink>
        <br />
        <NavLink
          to="/internship-application-section11"
          activeStyle={{ width: '100%', color: 'black', background: ' rgb(180, 228, 255)' }}
        >11. Future Plan
        </NavLink>
        <br />
        <h6 className="greyBG pt-2 pb-2 pl-2">PART B: GRANT AFFIRMATIONS</h6>
        <NavLink
          to="/internship-application-section12"
          activeStyle={{ width: '100%', color: 'black', background: ' rgb(180, 228, 255)' }}
        >12. Grant Affirmations
        </NavLink>
        <br />
        <h6 className="greyBG pt-2 pb-2 pl-2">CERTIFICATION</h6>
        <NavLink
          to="/internship-application-section13"
          activeStyle={{ width: '100%', color: 'black', background: ' rgb(180, 228, 255)' }}
        >13. Certification
        </NavLink>

      </MDBCardBody>
    </MDBCard>
  </div>
);
export default Sidebar;

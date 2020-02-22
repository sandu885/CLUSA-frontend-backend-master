import moment from 'moment';

export const questionList = {
  'question1-1': 'Q1.1 How many inters in the program this year?',
  'question1-2': 'Q1.2 How many complete their internship?',
  'question1-3': `Q1.3 if there are inters didn't complete their, why?`,
  'question2-1': `Q2.1 Total expense of ${moment().format('YYYY')} internship program?`,
  'question2-2': 'Q2.2 How much will be covered by your organization or other resource than CLUSA grant?',
  'question2-3': 'Q2.3 Download and fill out Expense report(an excel file)',
  'question3-1': `Q3.1 ${moment().format('YYYY')} Internship program summary`,
  'question3-2': `Q3.2 ${moment().format('YYYY')} Internship program reflection`,
  'question3-3': `Q3.3 Did your ${moment().format('YYYY')} internship program meet CLUSA’s three grant goals...? Explain`,
  'question3-4': `Q3.4 How should CLUSA improve this grant to better serve you? Any suggestions on grant application, training resources, etc.? *`,
};

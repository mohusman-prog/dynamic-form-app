const formconfig = [
{ id: 'name', type: 'text', label: 'Name', required: true },
{ id: 'email', type: 'email', label: 'Email', required: true },
{ id: 'age', type: 'number', label: 'Age', required: false, min: 18 },
{ id: 'gender', type: 'select', label: 'Gender', required: true, options: ['Male', 'Female', 'Other'] },
{ id: 'role', type: 'radio', label: 'Role', required: true, options: ['Developer', 'Designer', 'Manager'] },
{ id: 'skill', type: 'check-box', label: 'Skills', required: true, options: ['HTML', 'CSS', 'JS'] }
]

export default formconfig
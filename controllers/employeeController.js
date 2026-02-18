const Employee = require('../models/Employee');

// Get all employees
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().populate('manager', 'name email');
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get employee by ID
exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).populate('manager', 'name email');
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(employee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create new employee
exports.createEmployee = async (req, res) => {
  const employee = new Employee({
    name: req.body.name,
    email: req.body.email,
    department: req.body.department,
    position: req.body.position,
    manager: req.body.manager,
    status: req.body.status || 'Active',
  });

  try {
    const newEmployee = await employee.save();
    res.status(201).json(newEmployee);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update employee
exports.updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    if (req.body.name) employee.name = req.body.name;
    if (req.body.email) employee.email = req.body.email;
    if (req.body.department) employee.department = req.body.department;
    if (req.body.position) employee.position = req.body.position;
    if (req.body.manager) employee.manager = req.body.manager;
    if (req.body.status) employee.status = req.body.status;
    employee.updatedAt = Date.now();

    const updatedEmployee = await employee.save();
    res.json(updatedEmployee);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete employee
exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json({ message: 'Employee deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get employees by department
exports.getEmployeesByDepartment = async (req, res) => {
  try {
    const employees = await Employee.find({ department: req.params.department });
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

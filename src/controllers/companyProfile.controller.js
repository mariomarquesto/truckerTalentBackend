
const { validationResult } = require('express-validator');
const { AppDataSource } = require('../config/data-source');
const companyRepo = AppDataSource.getRepository('CompanyProfile');

async function handleErrors(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
}

exports.createOrUpdateBasicInfo = async (req, res) => {
  await handleErrors(req, res);

  try {
    const { email } = req.body;
    let company = await companyRepo.findOneBy({ email });

    if (!company) {
      company = companyRepo.create(req.body);
      await companyRepo.save(company);
      return res.status(201).json(company);
    } else {
      companyRepo.merge(company, req.body);
      await companyRepo.save(company);
      return res.json(company);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateContact = async (req, res) => {
  await handleErrors(req, res);

  try {
    const { id, phone, website } = req.body;
    const company = await companyRepo.findOneBy({ id });
    if (!company) return res.status(404).json({ message: 'Company not found' });

    if (phone !== undefined) company.phone = phone;
    if (website !== undefined) company.website = website;

    await companyRepo.save(company);
    res.json(company);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Repetí este patrón para todos los pasos:

exports.updateDescription = async (req, res) => {
  await handleErrors(req, res);

  try {
    const { id, description, industry } = req.body;
    const company = await companyRepo.findOneBy({ id });
    if (!company) return res.status(404).json({ message: 'Company not found' });

    if (description !== undefined) company.description = description;
    if (industry !== undefined) company.industry = industry;

    await companyRepo.save(company);
    res.json(company);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateSize = async (req, res) => {
  await handleErrors(req, res);

  try {
    const { id, employee_count } = req.body;
    const company = await companyRepo.findOneBy({ id });
    if (!company) return res.status(404).json({ message: 'Company not found' });

    if (employee_count !== undefined) company.employee_count = employee_count;

    await companyRepo.save(company);
    res.json(company);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ... Sigue con el resto de pasos igual, actualizando solo los campos que correspondan ...

exports.updateBusinessOperations = async (req, res) => {
  await handleErrors(req, res);

  try {
    const { id } = req.body;
    const company = await companyRepo.findOneBy({ id });
    if (!company) return res.status(404).json({ message: 'Company not found' });

    // Aquí debes actualizar los campos que tengas para operaciones de negocio.
    // Ejemplo:
    // if (req.body.trailer_rentals_preference !== undefined) company.trailer_rentals_preference = req.body.trailer_rentals_preference;

    await companyRepo.save(company);
    res.json(company);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateLoadPreferences = async (req, res) => {
  await handleErrors(req, res);

  try {
    const { id, preferred_load_types, preferred_routes } = req.body;
    const company = await companyRepo.findOneBy({ id });
    if (!company) return res.status(404).json({ message: 'Company not found' });

    if (preferred_load_types !== undefined) company.preferred_load_types = preferred_load_types;
    if (preferred_routes !== undefined) company.preferred_routes = preferred_routes;

    await companyRepo.save(company);
    res.json(company);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateSecondaryContact = async (req, res) => {
  await handleErrors(req, res);

  try {
    const { id, secondary_contact_name, secondary_contact_email, secondary_contact_phone } = req.body;
    const company = await companyRepo.findOneBy({ id });
    if (!company) return res.status(404).json({ message: 'Company not found' });

    if (secondary_contact_name !== undefined) company.secondary_contact_name = secondary_contact_name;
    if (secondary_contact_email !== undefined) company.secondary_contact_email = secondary_contact_email;
    if (secondary_contact_phone !== undefined) company.secondary_contact_phone = secondary_contact_phone;

    await companyRepo.save(company);
    res.json(company);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateLegalDocuments = async (req, res) => {
  await handleErrors(req, res);

  try {
    const {
      id,
      tax_id,
      mc_number,
      dot_number,
      has_us_authority,
      us_dot_registration_date,
      insurance_provider,
      insurance_policy_number,
      insurance_expiration_date,
    } = req.body;

    const company = await companyRepo.findOneBy({ id });
    if (!company) return res.status(404).json({ message: 'Company not found' });

    if (tax_id !== undefined) company.tax_id = tax_id;
    if (mc_number !== undefined) company.mc_number = mc_number;
    if (dot_number !== undefined) company.dot_number = dot_number;
    if (has_us_authority !== undefined) company.has_us_authority = has_us_authority;
    if (us_dot_registration_date !== undefined) company.us_dot_registration_date = us_dot_registration_date;
    if (insurance_provider !== undefined) company.insurance_provider = insurance_provider;
    if (insurance_policy_number !== undefined) company.insurance_policy_number = insurance_policy_number;
    if (insurance_expiration_date !== undefined) company.insurance_expiration_date = insurance_expiration_date;

    await companyRepo.save(company);
    res.json(company);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updatePaymentPreferences = async (req, res) => {
  await handleErrors(req, res);

  try {
    const { id, payment_terms_preference, billing_contact_email, billing_address } = req.body;
    const company = await companyRepo.findOneBy({ id });
    if (!company) return res.status(404).json({ message: 'Company not found' });

    if (payment_terms_preference !== undefined) company.payment_terms_preference = payment_terms_preference;
    if (billing_contact_email !== undefined) company.billing_contact_email = billing_contact_email;
    if (billing_address !== undefined) company.billing_address = billing_address;

    await companyRepo.save(company);
    res.json(company);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateFleetDetails = async (req, res) => {
  await handleErrors(req, res);

  try {
    const { id, total_fleet_size, primary_equipment_type, number_of_drivers } = req.body;
    const company = await companyRepo.findOneBy({ id });
    if (!company) return res.status(404).json({ message: 'Company not found' });

    if (total_fleet_size !== undefined) company.total_fleet_size = total_fleet_size;
    if (primary_equipment_type !== undefined) company.primary_equipment_type = primary_equipment_type;
    if (number_of_drivers !== undefined) company.number_of_drivers = number_of_drivers;

    await companyRepo.save(company);
    res.json(company);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateServices = async (req, res) => {
  await handleErrors(req, res);

  try {
    const { id, specialized_services, offers_brokerage_services, offers_dispatch_services } = req.body;
    const company = await companyRepo.findOneBy({ id });
    if (!company) return res.status(404).json({ message: 'Company not found' });

    if (specialized_services !== undefined) company.specialized_services = specialized_services;
    if (offers_brokerage_services !== undefined) company.offers_brokerage_services = offers_brokerage_services;
    if (offers_dispatch_services !== undefined) company.offers_dispatch_services = offers_dispatch_services;

    await companyRepo.save(company);
    res.json(company);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateConfirmation = async (req, res) => {
  await handleErrors(req, res);

  try {
    const { id, status } = req.body;
    const company = await companyRepo.findOneBy({ id });
    if (!company) return res.status(404).json({ message: 'Company not found' });

    if (status !== undefined) company.status = status;

    await companyRepo.save(company);
    res.json(company);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export class Contact {
  id: string;
  employeeId?: string;
  personalization: Personalization;

  telephone: string;
  email?: string;

  constructor(contact: ContactContract) {
    this.id = contact.id;
    this.employeeId = contact.employeeId ?? undefined;
    this.personalization = new Personalization(contact.personalization);
    this.telephone = contact.telephone.number;
    this.email = contact.email?.address;
  }
}

export class Personalization {
  name: Name;

  constructor(data: PersonalizationContract) {
    this.name = new Name(data.name);
  }
}

export class Name {
  firstname: string;
  lastname: string;
  middlename?: string;

  constructor(data: NameContract) {
    this.firstname = data.firstname;
    this.lastname = data.lastname;
    this.middlename = data.middlename;
  }
}

export interface ContactContract {
  id: string;
  employeeId: string | null;
  personalization: PersonalizationContract;
  telephone: {
    number: string;
  };
  email: {
    address: string;
  } | null;
}

export interface PersonalizationContract {
  name: NameContract;
  dateOfBirth?: string;
}

export interface NameContract {
  firstname: string;
  lastname: string;
  middlename?: string;
}

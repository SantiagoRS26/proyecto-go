import { UserDTO } from "../interfaces/dto/UserDTO";

export class User {
  public _id: string;
  public email: string;
  public name: string;
  public __v: number;
  public isAdmin: boolean;
  public notifyTrafficDecree: boolean;
  public notifyReportsOnInterestZones: boolean;

  constructor(data: UserDTO) {
    this._id = data._id;
    this.email = data.email;
    this.name = data.name;
    this.__v = data.__v;
    this.isAdmin = data.isAdmin;
    this.notifyTrafficDecree = data.notifyTrafficDecree;
    this.notifyReportsOnInterestZones = data.notifyReportsOnInterestZones;
  }
}
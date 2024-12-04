export class Usuario
{
  public id: number;
  public nome: string;
  public token: string;

  constructor() { 
    this.id = 0;
    this.nome = '';
    this.token = '';
  }
}
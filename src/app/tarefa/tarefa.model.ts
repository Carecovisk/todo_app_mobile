export class Tarefa {
    public id: number;
    public titulo: string;
    public descricao: string;
    public foto: string | undefined;

    /**
     *
     */
    constructor() {
        this.id = 0;
        this.descricao = '';
        this.titulo = '';
    }
}
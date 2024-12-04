import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tarefa } from "./tarefa.model";
import { Usuario } from '../home/usuario.model';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { IonicModule, LoadingController, NavController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-veiculo',
  templateUrl: './tarefa.page.html',
  styleUrls: ['./tarefa.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, HttpClientModule],
  providers: [HttpClient, Storage]
})
export class TarefaPage implements OnInit {

  public usuario: Usuario = new Usuario();
  public lista_tarefas: Tarefa[] = [];
  constructor(
    public http: HttpClient,
    public storage: Storage,
    public controle_toast: ToastController,
    public controle_navegacao: NavController,
    public controle_carregamento: LoadingController
  ) { }

  async ngOnInit() {
    await this.storage.create();
    const registro = await this.storage.get('usuario');

    if (registro) {
      this.usuario = Object.assign(new Usuario(), registro);
      this.consultarTarefasNaAPI()
    }
    else {
      this.controle_navegacao.navigateRoot('/home');
    }
  }

  async consultarTarefasNaAPI() {

    const loading = await this.controle_carregamento.create({ message: 'Pesquisando...', duration: 60000 });
    await loading.present();

    let http_headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${this.usuario.token}`
    });


    this.http.get(
      'http://localhost:8000/todo/api/listar/',
      {
        headers: http_headers
      },
    ).subscribe({
      next: async (resposta: any) => {
        this.lista_tarefas = resposta;

        loading.dismiss();
      },
      error: async (error: any) => {
        loading.dismiss();
        const mensagem = await this.controle_toast.create({
          message: `Falha ao consultar tarefas: ${error.message}`,
          cssClass: 'ion-text-center',
          duration: 2000
        });
        mensagem.present();
      }
    });
  }

  async editarTarefa(id: number) {

    // Inicializa interface com efeito de carregamento
    const loading = await this.controle_carregamento.create({ message: 'Autenticando...', duration: 30000 });
    await loading.present();

    let http_headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${this.usuario.token}`
    });

    // Deleta instância de veículo via API do sistema web
    this.http.delete(
      `http://127.0.0.1:8000/todo/api/editar/${id}/`,
      {
        headers: http_headers
      }
    ).subscribe({
      next: async (resposta: any) => {

        this.consultarTarefasNaAPI();

        // Finaliza interface com efeito de carregamento
        loading.dismiss();
      },
      error: async (erro: any) => {
        loading.dismiss();
        const mensagem = await this.controle_toast.create({
          message: `Falha ao excluir o tarefa: ${erro.message}`,
          cssClass: 'ion-text-center',
          duration: 2000
        });
        mensagem.present();
      }
    });
  }

  async excluirTarefa(id: number) {

    // Inicializa interface com efeito de carregamento
    const loading = await this.controle_carregamento.create({ message: 'Autenticando...', duration: 30000 });
    await loading.present();

    let http_headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${this.usuario.token}`
    });

    // Deleta instância de veículo via API do sistema web
    this.http.delete(
      `http://127.0.0.1:8000/todo/api/deletar/${id}/`,
      {
        headers: http_headers
      }
    ).subscribe({
      next: async (resposta: any) => {

        this.consultarTarefasNaAPI();

        // Finaliza interface com efeito de carregamento
        loading.dismiss();
      },
      error: async (erro: any) => {
        loading.dismiss();
        const mensagem = await this.controle_toast.create({
          message: `Falha ao excluir o tarefa: ${erro.message}`,
          cssClass: 'ion-text-center',
          duration: 2000
        });
        mensagem.present();
      }
    });
  }


}

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CursoService } from '../../../services/CursoService';
import { ModuloDTO } from '../../../models/modulo.dto';

@Component({
  selector: 'app-course-view-profesor',
  standalone: true, // <- obligatorio si es standalone
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './course-view-profesor.html',
  styleUrl: './course-view-profesor.scss',
})
export class CourseViewProfesor implements OnInit {
  courseId!: number;
  modulos: ModuloDTO[] = [];

  creandoModulo = false;
  nuevoModulo: any = null;

  editModalVisible = false;
  editTitle = '';
  editContext: any = null;
  editData: any = {};
  selectedFile: File | null = null;

  activeLink = 'courses';
  userMenuOpen = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cursoService: CursoService
  ) { }

  ngOnInit() {
    this.courseId = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarCurso();
  }

  cargarCurso() {
    this.cursoService.getCurso(this.courseId).subscribe({
      next: c => {
        this.modulos = (c.modulos || []).map(m => ({
          ...m,
          lecciones: (m.lecciones || []).map(l => ({
            ...l,
            materiales: l.materiales || [],
            evaluaciones: l.evaluaciones || []
          }))
        }));
      },
    });

  }
  //creal modulo ya gregar elementos
  comenzarNuevoModulo() {
    this.creandoModulo = true;
    this.nuevoModulo = {
      titulo: '',
      descripcion: '',
      lecciones: [{ titulo: '', descripcion: '', materiales: [], evaluaciones: [] }]  // UNA LECCIÓN POR DEFECTO
    };
  }


  cancelarNuevoModulo() {
    this.creandoModulo = false;
    this.nuevoModulo = null;
  }

  agregarLeccion() {
    this.nuevoModulo.lecciones.push({
      titulo: '',
      descripcion: '',
      materiales: [],
      evaluaciones: []
    });
  }

  agregarMaterial(li: number) {
    this.nuevoModulo.lecciones[li].materiales.push({
      tipo: 'PDF',
      url: '',
    });
  }

  agregarQuiz(li: number) {
    this.nuevoModulo.lecciones[li].evaluaciones.push({
      pregunta: '',
      opcionA: '',
      opcionB: '',
      opcionC: '',
      opcionD: '',
      respuestaCorrecta: ''
    });
  }

  guardarNuevoModulo() {
    const dto = {
      titulo: this.nuevoModulo.titulo,
      descripcion: this.nuevoModulo.descripcion,
      lecciones: this.nuevoModulo.lecciones
    };
    this.cursoService.agregarModulo(this.courseId, dto).subscribe({
      next: res => {
        this.modulos = res.modulos ?? [];
        this.creandoModulo = false;
        this.nuevoModulo = null;
        alert('Módulo guardado correctamente');  // MENSAJE DE ÉXITO
      },
      error: err => alert('Error al guardar módulo: ' + err.message)
    });
  }

  //abrir modal
  abrirModalModulo(mi: number) {
    const m = this.modulos[mi];
    this.editContext = { tipo: 'modulo', moduloIndex: mi };
    this.editData = { titulo: m.titulo, descripcion: m.descripcion };
    this.editTitle = 'Editar módulo';
    this.editModalVisible = true;
  }

  abrirModalLeccion(mi: number, li: number, esNueva = false) {
    const l = this.modulos[mi].lecciones![li];
    this.editContext = { tipo: 'leccion', moduloIndex: mi, leccionIndex: li, esNueva };
    this.editData = { titulo: l.titulo, descripcion: l.descripcion };
    this.editTitle = 'Editar lección';
    this.editModalVisible = true;
  }


  abrirModalMaterial(mi: number, li: number, mati: number) {
    const mat = this.modulos[mi].lecciones![li].materiales![mati];
    this.editContext = { tipo: 'material', moduloIndex: mi, leccionIndex: li, materialIndex: mati };
    this.editData = { tipo: mat.tipo, url: mat.url };
    this.selectedFile = null;
    this.editTitle = 'Editar material';
    this.editModalVisible = true;
  }

  abrirModalQuiz(mi: number, li: number, qi: number) {
    const q = this.modulos[mi].lecciones![li].evaluaciones![qi];
    this.editContext = { tipo: 'quiz', moduloIndex: mi, leccionIndex: li, quizIndex: qi };
    this.editData = { ...q };
    this.editTitle = 'Editar pregunta';
    this.editModalVisible = true;
  }

  cerrarModal() {
    // 🟢 Si era una lección nueva y quedó vacía, la quitamos del array
    if (this.editContext?.tipo === 'leccion' && this.editContext.esNueva) {
      const mi = this.editContext.moduloIndex;
      const li = this.editContext.leccionIndex;
      const leccion = this.modulos[mi].lecciones![li];

      const sinContenido =
        !leccion.id &&
        !leccion.titulo &&
        !leccion.descripcion &&
        (!leccion.materiales || leccion.materiales.length === 0) &&
        (!leccion.evaluaciones || leccion.evaluaciones.length === 0);

      if (sinContenido) {
        this.modulos[mi].lecciones!.splice(li, 1);
      }
    }

    this.editModalVisible = false;
    this.editContext = null;
    this.editData = {};
    this.selectedFile = null;
  }

  //guardar edicion
  guardarEdicion() {
    if (!this.editContext) return;
    const c = this.editContext;

    // 🟢 NUEVO MÓDULO
    if (c.tipo === 'nuevoModulo') {

      const dto = {
        titulo: this.editData.titulo,
        descripcion: this.editData.descripcion,
        lecciones: [] // lo creas sin lecciones por ahora
      };

      this.cursoService.agregarModulo(this.courseId, dto).subscribe({
        next: res => {
          this.cargarCurso(); // refresca la lista de módulos
          alert('Módulo creado correctamente');
          this.cerrarModal();
        },
        error: err => alert('Error al crear módulo: ' + err.message)
      });

      return; // muy importante
    }

    // EDITAR MODULO EN BD
    if (c.tipo === 'modulo') {
      const modulo = this.modulos[c.moduloIndex];

      const dto = {
        id: modulo.id,
        titulo: this.editData.titulo,
        descripcion: this.editData.descripcion
      };

      this.cursoService.editarModulo(this.courseId, modulo.id!, dto).subscribe({
        next: res => {
          this.modulos = res.modulos;
          this.cerrarModal();
        }
      });

      return;
    }

    // EDITAR LECCIÓN (solo front)
    if (c.tipo === 'leccion') {
      const dto = { titulo: this.editData.titulo, descripcion: this.editData.descripcion };
      if (c.esNueva) {
        // CREAR LECCIÓN NUEVA
        this.cursoService.crearLeccion(this.courseId, this.modulos[c.moduloIndex].id!, dto).subscribe({
          next: res => {
            this.modulos[c.moduloIndex].lecciones![c.leccionIndex].id = res.id;
            this.cargarCurso();  // Recarga todo desde BD
            alert('Lección creada correctamente');
            this.cerrarModal();
          },
          error: err => alert('Error al crear lección: ' + err.message)
        });
      } else {
        // EDITAR LECCIÓN EXISTENTE
        this.cursoService.editarLeccion(this.courseId, this.modulos[c.moduloIndex].id!, this.modulos[c.moduloIndex].lecciones![c.leccionIndex].id!, dto).subscribe({
          next: () => {
            this.cargarCurso();
            alert('Lección editada correctamente');
            this.cerrarModal();
          },
          error: err => alert('Error al editar lección: ' + err.message)
        });
      }
      return;
    }

    // MATERIAL
    if (c.tipo === 'material') {
      const material = this.modulos[c.moduloIndex].lecciones![c.leccionIndex].materiales![c.materialIndex];
      if (this.editData.tipo === 'PDF' && this.selectedFile) {
        // SUBIR PDF (existente)
        const formData = new FormData();
        formData.append('file', this.selectedFile);
        this.cursoService.subirMaterial(this.courseId, this.modulos[c.moduloIndex].id!, this.modulos[c.moduloIndex].lecciones![c.leccionIndex].id!, formData).subscribe({
          next: res => {
            material.url = res.url;
            material.id = res.id;
            material.tipo = 'PDF';
            alert('Material subido correctamente');
            this.cerrarModal();
          },
          error: err => alert('Error al subir material: ' + err.message)
        });
      } else if (this.editData.tipo === 'VIDEO') {
        // CREAR MATERIAL VIDEO
        const dto = { tipo: 'VIDEO', url: this.editData.url };
        this.cursoService.crearMaterialUrl(this.courseId, this.modulos[c.moduloIndex].id!, this.modulos[c.moduloIndex].lecciones![c.leccionIndex].id!, dto).subscribe({
          next: res => {
            material.url = res.url;
            material.id = res.id;
            material.tipo = 'VIDEO';
            this.cargarCurso();
            alert('Material creado correctamente');
            this.cerrarModal();
          },
          error: err => alert('Error al crear material: ' + err.message)
        });
      }
      return;
    }

    // QUIZ
    if (c.tipo === 'quiz') {
      const quiz = this.modulos[c.moduloIndex].lecciones![c.leccionIndex].evaluaciones![c.quizIndex];
      if (!quiz.id) {
        // CREAR QUIZ NUEVO
        this.cursoService.crearEvaluacion(this.courseId, this.modulos[c.moduloIndex].id!, this.modulos[c.moduloIndex].lecciones![c.leccionIndex].id!, this.editData).subscribe({
          next: res => {
            quiz.id = res.id;
            this.cargarCurso();  // Recarga todo desde BD
            alert('Evaluación creada correctamente');
            this.cerrarModal();
          },
          error: err => alert('Error al crear evaluación: ' + err.message)
        });
      } else {
        // EDITAR QUIZ EXISTENTE (si agregas endpoint, aquí llamas)
        Object.assign(quiz, this.editData);
        this.cargarCurso();
        alert('Evaluación editada correctamente');
        this.cerrarModal();
      }
      return;
    }
  }

  //Eliminar + agregar items con modal automático
  eliminarModulo(mi: number) {
    const m = this.modulos[mi];
    if (!confirm('¿Eliminar módulo?')) return;

    this.cursoService.eliminarModulo(this.courseId, m.id!).subscribe({
      next: () => this.modulos.splice(mi, 1)
    });
  }

  eliminarLeccion(mi: number, li: number) {
    const l = this.modulos[mi].lecciones![li];

    if (!confirm('¿Eliminar lección?')) return;

    // 🟢 Si la lección NO tiene id => nunca se guardó en BD, la removemos solo del array
    if (!l.id) {
      this.modulos[mi].lecciones!.splice(li, 1);
      return;
    }

    // 🟠 Si tiene id => sí existe en BD, llamamos al backend
    this.cursoService
      .eliminarLeccion(this.courseId, this.modulos[mi].id!, l.id!)
      .subscribe({
        next: () => this.modulos[mi].lecciones!.splice(li, 1),
        error: (err) => {
          console.error('Error al eliminar lección', err);
          alert('No se pudo eliminar la lección en el servidor.');
        },
      });
  }


  eliminarMaterial(mi: number, li: number, mati: number) {
    const mat = this.modulos[mi].lecciones![li].materiales![mati];

    // no existe en BD
    if (!mat.id) {
      this.modulos[mi].lecciones![li].materiales!.splice(mati, 1);
      return;
    }

    this.cursoService.eliminarMaterial(
      this.courseId,
      this.modulos[mi].id!,
      this.modulos[mi].lecciones![li].id!,
      mat.id!
    ).subscribe(() => {
      this.modulos[mi].lecciones![li].materiales!.splice(mati, 1);
    });
  }

  eliminarQuiz(mi: number, li: number, qi: number) {
    const q = this.modulos[mi].lecciones![li].evaluaciones![qi];

    if (!q.id) {
      this.modulos[mi].lecciones![li].evaluaciones!.splice(qi, 1);
      return;
    }

    this.cursoService.eliminarEvaluacion(
      this.courseId,
      this.modulos[mi].id!,
      this.modulos[mi].lecciones![li].id!,
      q.id!
    ).subscribe(() => {
      this.modulos[mi].lecciones![li].evaluaciones!.splice(qi, 1);
    });
  }

  // agregar y ABRIR MODAL INMEDIATAMENTE
  agregarLeccionExistente(mi: number) {
    this.modulos[mi].lecciones ??= [];

    this.modulos[mi].lecciones!.push({
      id: undefined,
      titulo: '',
      descripcion: '',
      materiales: [],
      evaluaciones: []
    });

    const li = this.modulos[mi].lecciones!.length - 1;
    // 🟢 Marcamos que es una nueva lección
    this.abrirModalLeccion(mi, li, true);
  }


  agregarMaterialExistente(mi: number, li: number) {
    this.modulos[mi].lecciones![li].materiales!.push({
      tipo: 'PDF',
      url: ''
    });

    const mati = this.modulos[mi].lecciones![li].materiales!.length - 1;
    this.abrirModalMaterial(mi, li, mati);
  }

  agregarQuizExistente(mi: number, li: number) {
    this.modulos[mi].lecciones![li].evaluaciones!.push({
      pregunta: '',
      opcionA: '',
      opcionB: '',
      opcionC: '',
      opcionD: '',
      respuestaCorrecta: ''
    });

    const qi = this.modulos[mi].lecciones![li].evaluaciones!.length - 1;
    this.abrirModalQuiz(mi, li, qi);
  }

  onMaterialTypeChange() {
    this.selectedFile = null;
    this.editData.url = '';
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  setActive(link: string) {
    this.activeLink = link;
  }

  toggleUserMenu() {
    this.userMenuOpen = !this.userMenuOpen;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
  // Nuevo método: manejar selección de tipo en la lección del nuevo módulo
  seleccionarTipoEnNuevaLeccion(tipo: string) {
    const leccion = this.nuevoModulo.lecciones[0];
    leccion.tipoSeleccionado = tipo;
    if (tipo === 'Material') {
      // Agregar material vacío y abrir modal
      leccion.materiales.push({ tipo: 'PDF', url: '' });
      this.abrirModalMaterialParaNuevo(0, 0); // Índices fijos para nuevo módulo
    } else if (tipo === 'Quiz') {
      // Agregar quiz vacío y abrir modal
      leccion.evaluaciones.push({
        pregunta: '',
        opcionA: '',
        opcionB: '',
        opcionC: '',
        opcionD: '',
        respuestaCorrecta: ''
      });
      this.abrirModalQuizParaNuevo(0, 0);
    }
  }
  // Métodos auxiliares para abrir modal en nuevo módulo
  abrirModalMaterialParaNuevo(leccionIndex: number, materialIndex: number) {
    this.editContext = { tipo: 'material', esNuevoModulo: true, leccionIndex, materialIndex };
    this.editData = { tipo: 'PDF', url: '' };
    this.selectedFile = null;
    this.editTitle = 'Subir Material (PDF)';
    this.editModalVisible = true;
  }
  abrirModalQuizParaNuevo(leccionIndex: number, quizIndex: number) {
    this.editContext = { tipo: 'quiz', esNuevoModulo: true, leccionIndex, quizIndex };
    this.editData = {
      pregunta: '',
      opcionA: '',
      opcionB: '',
      opcionC: '',
      opcionD: '',
      respuestaCorrecta: ''
    };
    this.editTitle = 'Crear Quiz';
    this.editModalVisible = true;
  }

  abrirModalNuevoModulo() {
    this.editContext = { tipo: 'nuevoModulo' }; // 👈 clave
    this.editTitle = 'Crear nuevo módulo';
    this.editData = {
      titulo: '',
      descripcion: ''
    };
    this.editModalVisible = true;
  }


}
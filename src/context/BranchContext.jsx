import { createContext, useContext, useState } from "react";
import { branch } from "../data";
import {
  defaultBranch,
  defaultVerificacion_Critica,
  defaultVerificacion_Extra,
  defaultEvento,
  defaultSubtipos_Siniestro,
  defaultTipificacion,
  defaultDocumento,
} from "../constants/variablesGlobales";

const BranchContext = createContext(null);
export const useBranchContext = () => useContext(BranchContext);

const BranchContextProvider = ({ children }) => {
  const [currentBranch, setCurrentBranch] = useState(null);
  const [branches, setBranches] = useState(branch);

  const setUpCurrentBranch = (id) => {
    const newbranch = branches.find((ramo) => ramo._id === id);
    setCurrentBranch(newbranch);
  };
  // cada vez que tengo que updatear currentBranch tengo que updatear branches porque sino el setCurrentBranch va a buscar en branches desactualizado
  //Este metodo solamente se utiliza para updatear branches a nivel general, cuando este la BBDD solo se actualizara el ramo en cuestion
  const updateBranchesData = (newBranch) => {
    const newBranches = [...branches];
    const index = branches.findIndex((ramo) => ramo._id === newBranch.branch_id);
    newBranches[index] = newBranch;
    setBranches(newBranches);
  };
  // Este metodo setea el estado de el branch seleccionado
  const updateStatusBranch = (branch_id, status) => {
    const newBranch = branches.find((ramo) => ramo._id === branch_id); //en newBranch guardo el ramo encontrado con el id clickeado
    newBranch.estado = status; //le cambio la propiedad estado
    updateBranchesData(newBranch);
  };
  //con este metodo agrego un branch a branches
  const addBranchToBranches = (titulo_branch) => {
    const newBranch = { ...defaultBranch };
    newBranch.titulo_Ramo = titulo_branch;
    newBranch._id = new Date().valueOf().toString();
    setBranches([...branches, newBranch]);
  };
  //Este metodo agrega una verificacion Critica o Extra al branch seleccionado segun el tipoverificacion que le llega desde UpdateVerificaciones.jsx
  const addVerificacionToBranch = (verificacion, tipoVerificacion) => {
    const newBranch = currentBranch;
    if (tipoVerificacion === "Critica") {
      const newVerificacionesCriticas = { ...defaultVerificacion_Critica };
      newVerificacionesCriticas.titulo = verificacion.titulo_Verificacion_Critica;
      newVerificacionesCriticas.descripcion = verificacion.descripcion_Verificacion_Critica;
      newBranch.verificaciones.verificaciones_Criticas = [
        ...currentBranch.verificaciones.verificaciones_Criticas,
        newVerificacionesCriticas,
      ];
    } else {
      const newVerificacionesExtras = { ...defaultVerificacion_Extra };
      newVerificacionesExtras.titulo = verificacion.titulo_Verificacion_Extra;
      newVerificacionesExtras.descripcion = verificacion.descripcion_Verificacion_Extra;

      newBranch.verificaciones.verificaciones_Extras = [
        ...currentBranch.verificaciones.verificaciones_Extras,
        newVerificacionesExtras,
      ];
    }
    setCurrentBranch(newBranch);
    updateBranchesData(newBranch);
  };
  //Este metodo elimina la verificacion Critica o Extra al branch seleccionado segun el id de verificacion y el tipo de verificacion
  const deleteVerificacionFromBranch = (idVerificacion, tipoVerificacion) => {
    const newBranch = currentBranch;
    if (tipoVerificacion === "Critica") {
      const newVerificacionesCriticas = currentBranch.verificaciones.verificaciones_Criticas.filter(
        (verif) => verif._id !== idVerificacion
      );
      newBranch.verificaciones.verificaciones_Criticas = newVerificacionesCriticas;
    } else {
      const newVerificacionesExtras = currentBranch.verificaciones.verificaciones_Extras.filter(
        (verif) => verif._id !== idVerificacion
      );
      newBranch.verificaciones.verificaciones_Extras = newVerificacionesExtras;
    }

    setCurrentBranch(newBranch);
    updateBranchesData(newBranch);
  };
  // Este metodo actualiza la verificacion segun el id y el tipo de verificacion
  const updateVerificacionFromBranch = (verificacion, tipoVerificacion) => {
    const newBranch = currentBranch;
    if (tipoVerificacion === "Critica") {
      const index = currentBranch.verificaciones.verificaciones_Criticas.findIndex(
        (verif) => verif._id === verificacion.id
      );

      newBranch.verificaciones.verificaciones_Criticas[index].titulo = verificacion.titulo_Verificacion_Critica;
      newBranch.verificaciones.verificaciones_Criticas[index].descripcion =
        verificacion.descripcion_Verificacion_Critica;
    } else {
      const index = currentBranch.verificaciones.verificaciones_Extras.findIndex(
        (verif) => verif._id === verificacion.id
      );
      newBranch.verificaciones.verificaciones_Extras[index].titulo = verificacion.titulo_Verificacion_Extra;
      newBranch.verificaciones.verificaciones_Extras[index].descripcion = verificacion.descripcion_Verificacion_Extra;
    }

    setCurrentBranch(newBranch);
    updateBranchesData(newBranch);
  };
  //ABM DE EVENTOS
  const addEventoToBranch = (evento) => {
    const newBranch = currentBranch;
    const newEvento = { ...defaultEvento };
    newEvento.siniestro = evento.tituloEvento;
    newEvento._id = new Date().valueOf().toString();
    newBranch.eventos = [...currentBranch.eventos, newEvento];
    setCurrentBranch(newBranch);
    updateBranchesData(newBranch);
  };
  const deleteEventoFromBranch = (idEvento) => {
    const newBranch = currentBranch;
    newBranch.eventos = currentBranch.eventos.filter((evento) => evento._id !== idEvento);
    console.log(newBranch);
    setCurrentBranch(newBranch);
    updateBranchesData(newBranch);
  };
  const updateEventoFromBranch = (idEvento, updatedEvento) => {
    const newBranch = currentBranch;
    const indexEvento = currentBranch.eventos.findIndex((evento) => evento._id === idEvento);
    newBranch.eventos[indexEvento].siniestro = updatedEvento;
    setCurrentBranch(newBranch);
    updateBranchesData(newBranch);
  };
  //ABM DE SUBTIPOS
  const addSubtipo_siniestro = (subtipo, idEvento) => {
    const newBranch = currentBranch;
    const newSubtipo = { ...defaultSubtipos_Siniestro };
    newSubtipo._id = new Date().valueOf().toString();
    newSubtipo.descripcion = subtipo.tituloSubtipo;
    const indexEvento = currentBranch.eventos.findIndex((evento) => evento._id === idEvento); // tengo que encontrar la posicion del evento a la que le estoy agregando el subtipo
    newBranch.eventos[indexEvento].subtipos_Siniestro = [
      ...currentBranch.eventos[indexEvento].subtipos_Siniestro,
      newSubtipo,
    ];
    setCurrentBranch(newBranch);
    updateBranchesData(newBranch);
  };
  const deleteSubtipo_siniestroFromBranch = (idSubtipo, idEvento) => {
    const newBranch = currentBranch;
    const indexEvento = currentBranch.eventos.findIndex((evento) => evento._id === idEvento); // tengo que encontrar la posicion del evento a la que le estoy agregando el subtipo
    newBranch.eventos[indexEvento].subtipos_Siniestro = currentBranch.eventos[indexEvento].subtipos_Siniestro.filter(
      (subtipo) => subtipo._id !== idSubtipo
    );
    setCurrentBranch(newBranch);
    updateBranchesData(newBranch);
  };
  const updateSubtipo_siniestroFromBranch = (idSubtipo, updatedSubtipo, idEvento) => {
    const newBranch = currentBranch;
    const indexEvento = currentBranch.eventos.findIndex((evento) => evento._id === idEvento);
    const indexSubtipo = currentBranch.eventos[indexEvento].subtipos_Siniestro.findIndex(
      (subtipo) => subtipo._id === idSubtipo
    );
    newBranch.eventos[indexEvento].subtipos_Siniestro[indexSubtipo].descripcion = updatedSubtipo;
    setCurrentBranch(newBranch);
    updateBranchesData(newBranch);
  };

  //ABM DE TIPIFICACIONES
  const addTipificacionToBranch = (tipificacion, idSubtipo, idEvento) => {
    const newBranch = currentBranch;
    const newTipificacion = { ...defaultTipificacion };
    newTipificacion._id = new Date().valueOf().toString();
    newTipificacion.evento = tipificacion.situacion;
    newTipificacion.core = tipificacion.core;
    newTipificacion.accion = tipificacion.accion;
    newTipificacion.tipo_de_resultado = tipificacion.tipgesdesc;
    newTipificacion.resultado_de_gestion = tipificacion.resgesdesc;
    const indexEvento = currentBranch.eventos.findIndex((evento) => evento._id === idEvento);
    const indexSubtipo = currentBranch.eventos[indexEvento].subtipos_Siniestro.findIndex(
      (subtipo) => subtipo._id === idSubtipo
    );

    newBranch.eventos[indexEvento].subtipos_Siniestro[indexSubtipo].tipificacion = [
      ...newBranch.eventos[indexEvento].subtipos_Siniestro[indexSubtipo].tipificacion,
      newTipificacion,
    ];
    setCurrentBranch(newBranch);
    updateBranchesData(newBranch);
  };
  const deleteTipificacionFromBranch = (tipificacionId, idSubtipo, idEvento) => {
    const newBranch = currentBranch;
    const indexEvento = currentBranch.eventos.findIndex((evento) => evento._id === idEvento);
    const indexSubtipo = currentBranch.eventos[indexEvento].subtipos_Siniestro.findIndex(
      (subtipo) => subtipo._id === idSubtipo
    );
    newBranch.eventos[indexEvento].subtipos_Siniestro[indexSubtipo].tipificacion = newBranch.eventos[
      indexEvento
    ].subtipos_Siniestro[indexSubtipo].tipificacion.filter((tipif) => tipif._id !== tipificacionId);
    setCurrentBranch(newBranch);
    updateBranchesData(newBranch);
  };
  const updateTipificacionFromBranch = (tipificacionId, updatedTipificacion, idSubtipo, idEvento) => {
    const newBranch = currentBranch;
    const indexEvento = currentBranch.eventos.findIndex((evento) => evento._id === idEvento);
    const indexSubtipo = currentBranch.eventos[indexEvento].subtipos_Siniestro.findIndex(
      (subtipo) => subtipo._id === idSubtipo
    );
    const indexTipif = currentBranch.eventos[indexEvento].subtipos_Siniestro[indexSubtipo].tipificacion.findIndex(
      (tipif) => tipif._id === tipificacionId
    );
    newBranch.eventos[indexEvento].subtipos_Siniestro[indexSubtipo].tipificacion[indexTipif].evento =
      updatedTipificacion.situacion;
    newBranch.eventos[indexEvento].subtipos_Siniestro[indexSubtipo].tipificacion[indexTipif].core =
      updatedTipificacion.core;
    newBranch.eventos[indexEvento].subtipos_Siniestro[indexSubtipo].tipificacion[indexTipif].accion =
      updatedTipificacion.accion;
    newBranch.eventos[indexEvento].subtipos_Siniestro[indexSubtipo].tipificacion[indexTipif].tipo_de_resultado =
      updatedTipificacion.tipgesdesc;
    newBranch.eventos[indexEvento].subtipos_Siniestro[indexSubtipo].tipificacion[indexTipif].resultado_de_gestion =
      updatedTipificacion.resgesdesc;
    setCurrentBranch(newBranch);
    updateBranchesData(newBranch);
    // console.log("index evento :", indexEvento, "\nIndexSubtipo : ", indexSubtipo, "\nindexTipificacion : ", indexTipif);
  };

  //ABM DE DOCUMENTOS
  const addDocumentoToBranch = (newDocumento, idSubtipo, idEvento) => {
    const newBranch = currentBranch;
    const newDoc = { ...defaultDocumento };
    newDoc._id = new Date().valueOf().toString();
    newDoc.titulo = newDocumento;
    const indexEvento = currentBranch.eventos.findIndex((evento) => evento._id === idEvento); // tengo que encontrar la posicion del evento a la que le estoy agregando el subtipo
    const indexSubtipo = currentBranch.eventos[indexEvento].subtipos_Siniestro.findIndex(
      (subtipo) => subtipo._id === idSubtipo
    );
    newBranch.eventos[indexEvento].subtipos_Siniestro[indexSubtipo].documentacion = [
      ...newBranch.eventos[indexEvento].subtipos_Siniestro[indexSubtipo].documentacion,
      newDoc,
    ];

    setCurrentBranch(newBranch);
    updateBranchesData(newBranch);
  };
  const deleteDocumentoFromBranch = (idDoc, idSubtipo, idEvento) => {
    const newBranch = currentBranch;
    const indexEvento = currentBranch.eventos.findIndex((evento) => evento._id === idEvento);
    const indexSubtipo = currentBranch.eventos[indexEvento].subtipos_Siniestro.findIndex(
      (subtipo) => subtipo._id === idSubtipo
    );
    newBranch.eventos[indexEvento].subtipos_Siniestro[indexSubtipo].documentacion = newBranch.eventos[
      indexEvento
    ].subtipos_Siniestro[indexSubtipo].documentacion.filter((doc) => doc._id !== idDoc);
    setCurrentBranch(newBranch);
    updateBranchesData(newBranch);
  };
  const updateDocumentoFromBranch = (idDoc, updatedDoc, idSubtipo, idEvento) => {
    const newBranch = currentBranch;
    const indexEvento = currentBranch.eventos.findIndex((evento) => evento._id === idEvento);
    const indexSubtipo = currentBranch.eventos[indexEvento].subtipos_Siniestro.findIndex(
      (subtipo) => subtipo._id === idSubtipo
    );
    const indexDoc = currentBranch.eventos[indexEvento].subtipos_Siniestro[indexSubtipo].documentacion.findIndex(
      (doc) => doc._id === idDoc
    );
    newBranch.eventos[indexEvento].subtipos_Siniestro[indexSubtipo].documentacion[indexDoc].titulo =
      updatedDoc.tituloDocumento;
    setCurrentBranch(newBranch);
    updateBranchesData(newBranch);
  };

  return (
    <BranchContext.Provider
      value={{
        currentBranch,
        setUpCurrentBranch,
        updateStatusBranch,
        branches,
        addBranchToBranches,
        addVerificacionToBranch,
        deleteVerificacionFromBranch,
        updateVerificacionFromBranch,
        addEventoToBranch,
        deleteEventoFromBranch,
        updateEventoFromBranch,
        addSubtipo_siniestro,
        deleteSubtipo_siniestroFromBranch,
        updateSubtipo_siniestroFromBranch,
        addDocumentoToBranch,
        deleteDocumentoFromBranch,
        updateDocumentoFromBranch,
        addTipificacionToBranch,
        deleteTipificacionFromBranch,
        updateTipificacionFromBranch,
      }}
    >
      {children}
    </BranchContext.Provider>
  );
};

export default BranchContextProvider;

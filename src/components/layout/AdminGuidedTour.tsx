"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  ACTIONS,
  EVENTS,
  ORIGIN,
  STATUS,
  Joyride,
  type EventData,
  type Step,
} from "react-joyride";

type GuidedStep = Step & {
  route?: string;
  openSections?: string[];
  forceExpandSidebar?: boolean;
  closeSelector?: string;
  openSelector?: string;
  skipGlobalScroll?: boolean;
};

type AdminGuidedTourProps = {
  onOpenSections: (sections: string[]) => void;
  onForceExpandSidebar: () => void;
};

const isElementInViewport = (element: Element) => {
  const rect = element.getBoundingClientRect();
  const vh = window.innerHeight || document.documentElement.clientHeight;
  const vw = window.innerWidth || document.documentElement.clientWidth;

  return rect.top >= 0 && rect.left >= 0 && rect.bottom <= vh && rect.right <= vw;
};

const clickIfExists = (selector?: string) => {
  if (!selector) {
    return;
  }

  const node = document.querySelector<HTMLElement>(selector);
  if (node) {
    node.click();
  }
};

export function AdminGuidedTour({ onOpenSections, onForceExpandSidebar }: AdminGuidedTourProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [run, setRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  const steps = useMemo<GuidedStep[]>(
    () => [
      {
        target: ".tour-start-floating",
        content: "Este boton siempre te permite iniciar o reiniciar el recorrido guiado.",
        placement: "left",
        route: "/dashboard/inicio/reportes",
        skipGlobalScroll: true,
      },
      {
        target: ".menu-inicio",
        content: "Aqui encuentras el modulo Inicio con accesos rapidos institucionales.",
        route: "/dashboard/inicio/reportes",
        openSections: ["Inicio"],
        forceExpandSidebar: true,
        skipGlobalScroll: true,
      },
      {
        target: ".submenu-inicio-reportes",
        content: "Entramos en Reportes para revisar indicadores iniciales.",
        route: "/dashboard/inicio/reportes",
        openSections: ["Inicio"],
        skipGlobalScroll: true,
      },
      {
        target: ".submenu-inicio-resoluciones",
        content: "Desde Resoluciones puedes navegar a los actos administrativos del dia.",
        route: "/dashboard/inicio/resoluciones",
        openSections: ["Inicio"],
        skipGlobalScroll: true,
      },
      {
        target: ".submenu-inicio-agenda-hoy",
        content: "Agenda Hoy concentra pendientes operativos del panel.",
        route: "/dashboard/inicio/agenda-hoy",
        openSections: ["Inicio"],
        skipGlobalScroll: true,
      },
      {
        target: ".menu-normatividad",
        content: "Ahora abrimos Normatividad para gestionar acuerdos y manuales.",
        route: "/dashboard/normatividad/acuerdos",
        openSections: ["Normatividad"],
        forceExpandSidebar: true,
        skipGlobalScroll: true,
      },
      {
        target: ".submenu-normatividad-acuerdos",
        content: "Acuerdos es la vista principal de normas presupuestales.",
        route: "/dashboard/normatividad/acuerdos",
        openSections: ["Normatividad"],
        skipGlobalScroll: true,
      },
      {
        target: ".tour-acuerdos-nuevo",
        content: "Con este boton creas un nuevo acuerdo.",
        route: "/dashboard/normatividad/acuerdos",
      },
      {
        target: ".tour-acuerdos-form",
        content: "Este formulario captura datos normativos del acuerdo.",
        route: "/dashboard/normatividad/acuerdos",
        openSelector: ".tour-acuerdos-nuevo",
        closeSelector: ".tour-acuerdos-cerrar",
        skipGlobalScroll: true,
      },
      {
        target: ".tour-acuerdos-guardar",
        content: "Guarda el acuerdo luego de completar la informacion obligatoria.",
        route: "/dashboard/normatividad/acuerdos",
        openSelector: ".tour-acuerdos-nuevo",
        closeSelector: ".tour-acuerdos-cerrar",
        skipGlobalScroll: true,
      },
      {
        target: ".menu-presupuesto-inicial",
        content: "Pasamos a Presupuesto Inicial para ingresos, gastos y ejecucion.",
        route: "/dashboard/presupuesto/ingresos",
        openSections: ["Presupuesto Inicial"],
        forceExpandSidebar: true,
        skipGlobalScroll: true,
      },
      {
        target: ".submenu-presupuesto-inicial-ingresos",
        content: "Ingresos centraliza rubros y movimientos por fuente.",
        route: "/dashboard/presupuesto/ingresos",
        openSections: ["Presupuesto Inicial"],
        skipGlobalScroll: true,
      },
      {
        target: ".tour-ingresos-nuevo",
        content: "Inicia el flujo de nuevo ingreso desde aqui.",
        route: "/dashboard/presupuesto/ingresos",
      },
      {
        target: ".tour-modal-ingreso",
        content: "Este modal te obliga a seleccionar un nodo valido del catalogo.",
        route: "/dashboard/presupuesto/ingresos",
        openSelector: ".tour-ingresos-nuevo",
        closeSelector: ".tour-modal-close",
        skipGlobalScroll: true,
      },
      {
        target: ".tour-ingresos-continuar",
        content: "Continuar crea el ingreso con el nodo seleccionado.",
        route: "/dashboard/presupuesto/ingresos",
        openSelector: ".tour-ingresos-nuevo",
        closeSelector: ".tour-modal-close",
        skipGlobalScroll: true,
      },
      {
        target: ".tour-modificacion-presupuesto",
        content: "Este acceso abre el flujo de modificacion presupuestal.",
        route: "/dashboard/presupuesto/ingresos",
      },
      {
        target: ".tour-modal-modificacion",
        content: "Aqui se validan requisitos y resolucion para la modificacion.",
        route: "/dashboard/presupuesto/ingresos",
        openSelector: ".tour-modificacion-presupuesto",
        closeSelector: ".tour-modal-close",
        skipGlobalScroll: true,
      },
      {
        target: ".tour-modificacion-continuar",
        content: "Continuar registra la solicitud de modificacion.",
        route: "/dashboard/presupuesto/ingresos",
        openSelector: ".tour-modificacion-presupuesto",
        closeSelector: ".tour-modal-close",
        skipGlobalScroll: true,
      },
      {
        target: ".submenu-presupuesto-inicial-gastos",
        content: "Tambien puedes moverte a Gastos para operaciones de egreso.",
        route: "/dashboard/presupuesto/gastos",
        openSections: ["Presupuesto Inicial"],
        skipGlobalScroll: true,
      },
      {
        target: ".tour-gastos-nuevo",
        content: "Este boton crea un nuevo gasto en la vigencia actual.",
        route: "/dashboard/presupuesto/gastos",
      },
      {
        target: ".menu-estadisticas",
        content: "Estadisticas presenta tendencias y comportamiento presupuestal.",
        route: "/dashboard/estadisticas",
        skipGlobalScroll: true,
      },
      {
        target: ".menu-reportes",
        content: "Reportes habilita exportaciones oficiales para auditoria.",
        route: "/dashboard/reportes/exportar-xls",
        openSections: ["Reportes"],
        forceExpandSidebar: true,
        skipGlobalScroll: true,
      },
      {
        target: ".submenu-reportes-exportar-xls",
        content: "Exportar XLS genera salidas tabulares para analisis.",
        route: "/dashboard/reportes/exportar-xls",
        openSections: ["Reportes"],
        skipGlobalScroll: true,
      },
      {
        target: ".submenu-reportes-exportar-pdf",
        content: "Exportar PDF prepara informes institucionales listos para firma.",
        route: "/dashboard/reportes/exportar-pdf",
        openSections: ["Reportes"],
        skipGlobalScroll: true,
      },
      {
        target: ".menu-administracion",
        content: "Administracion concentra usuarios, roles y permisos.",
        route: "/dashboard/administracion/usuarios",
        openSections: ["Administracion"],
        forceExpandSidebar: true,
        skipGlobalScroll: true,
      },
      {
        target: ".submenu-administracion-usuarios",
        content: "Entramos a Usuarios para alta, edicion y eliminacion.",
        route: "/dashboard/administracion/usuarios",
        openSections: ["Administracion"],
        skipGlobalScroll: true,
      },
      {
        target: ".tour-usuarios-nuevo",
        content: "Nuevo usuario abre el formulario para registro en base de datos.",
        route: "/dashboard/administracion/usuarios",
      },
      {
        target: ".tour-usuarios-form",
        content: "Este modal permite asignar rol institucional desde el inicio.",
        route: "/dashboard/administracion/usuarios",
        openSelector: ".tour-usuarios-nuevo",
        closeSelector: ".tour-usuarios-cancelar",
        skipGlobalScroll: true,
      },
      {
        target: ".tour-usuarios-guardar",
        content: "Guardar completa la creacion o modificacion del usuario.",
        route: "/dashboard/administracion/usuarios",
        openSelector: ".tour-usuarios-nuevo",
        closeSelector: ".tour-usuarios-cancelar",
        skipGlobalScroll: true,
      },
      {
        target: ".menu-auditoria",
        content: "Auditoria ofrece trazabilidad de accesos y actividad.",
        route: "/dashboard/auth/audit-logs",
        openSections: ["Auditoria"],
        forceExpandSidebar: true,
        skipGlobalScroll: true,
      },
      {
        target: ".submenu-auditoria-logs-de-acceso",
        content: "Logs de acceso te permite revisar eventos de seguridad.",
        route: "/dashboard/auth/audit-logs",
        openSections: ["Auditoria"],
        skipGlobalScroll: true,
      },
      {
        target: ".tour-profile-trigger",
        content: "Final del recorrido. Desde este menu gestionas perfil y cierre de sesion.",
        route: "/dashboard/auth/audit-logs",
        skipGlobalScroll: true,
      },
    ],
    [],
  );

  const moveToStep = useCallback(
    (nextIndex: number) => {
      const normalizedIndex = Math.max(0, Math.min(nextIndex, steps.length - 1));
      setStepIndex(normalizedIndex);
    },
    [steps.length],
  );

  useEffect(() => {
    if (!run) {
      return;
    }

    const currentStep = steps[stepIndex];
    if (!currentStep) {
      return;
    }

    if (currentStep.forceExpandSidebar) {
      onForceExpandSidebar();
    }

    onOpenSections(currentStep.openSections ?? []);
    clickIfExists(currentStep.openSelector);

    if (currentStep.route && pathname !== currentStep.route) {
      router.push(currentStep.route);
    }
  }, [
    onForceExpandSidebar,
    onOpenSections,
    pathname,
    router,
    run,
    stepIndex,
    steps,
  ]);

  useEffect(() => {
    if (!run) {
      return;
    }

    const currentStep = steps[stepIndex];
    if (!currentStep || currentStep.skipGlobalScroll) {
      return;
    }

    const timeout = window.setTimeout(() => {
      const targetNode = document.querySelector(currentStep.target as string);
      if (!targetNode) {
        return;
      }

      if (!isElementInViewport(targetNode)) {
        targetNode.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
      }
    }, 220);

    return () => window.clearTimeout(timeout);
  }, [pathname, run, stepIndex, steps]);

  const handleJoyrideCallback = useCallback(
    (data: EventData) => {
      const { action, index, origin, status, type } = data;

      if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
        setRun(false);
        setStepIndex(0);
        onOpenSections([]);
        return;
      }

      if (type === EVENTS.TARGET_NOT_FOUND) {
        const currentStep = steps[index];
        if (currentStep?.route && pathname !== currentStep.route) {
          return;
        }

        if (action === ACTIONS.PREV) {
          moveToStep(index - 1);
        } else {
          moveToStep(index + 1);
        }
        return;
      }

      if (type === EVENTS.STEP_AFTER) {
        if (action === ACTIONS.NEXT) {
          clickIfExists(steps[index]?.closeSelector);
          moveToStep(index + 1);
          return;
        }

        if (action === ACTIONS.PREV) {
          moveToStep(index - 1);
          return;
        }
      }

      if (action === ACTIONS.CLOSE && origin === ORIGIN.KEYBOARD) {
        setRun(false);
      }
    },
    [moveToStep, onOpenSections, pathname, steps],
  );

  const handleStartOrRestart = () => {
    setStepIndex(0);
    setRun(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleStartOrRestart}
        className="tour-start-floating fixed right-5 bottom-6 z-[250] rounded-full border border-[#d5bb87] bg-[#00284d] px-4 py-3 text-[10px] font-black uppercase tracking-[2px] text-[#efd9af] shadow-xl transition-colors hover:bg-[#003e70]"
      >
        {run ? "Reiniciar tour" : "Iniciar tour"}
      </button>

      <Joyride
        onEvent={handleJoyrideCallback}
        continuous
        options={{
          arrowColor: "#00284d",
          backgroundColor: "#00284d",
          buttons: ["back", "close", "primary", "skip"],
          overlayClickAction: false,
          overlayColor: "rgba(0, 40, 77, 0.48)",
          primaryColor: "#d5bb87",
          showProgress: true,
          textColor: "#efd9af",
          zIndex: 260,
        }}
        run={run}
        scrollToFirstStep={false}
        stepIndex={stepIndex}
        steps={steps}
        styles={{
          buttonBack: {
            color: "#efd9af",
          },
          buttonClose: {
            color: "#efd9af",
          },
          buttonSkip: {
            color: "#efd9af",
          },
          tooltipContainer: {
            textAlign: "left",
          },
        }}
        locale={{
          back: "Atras",
          close: "Cerrar",
          last: "Finalizar",
          next: "Siguiente",
          nextWithProgress: "Siguiente ({current}/{total})",
          skip: "Saltar",
        }}
      />
    </>
  );
}

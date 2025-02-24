import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimestampToDateTime(
  timestamp: string | number,
  locale: string = "en-US"
) {
  const date = new Date(Number(timestamp));
  return date.toLocaleString(locale, {
    // year: "numeric",
    // month: "2-digit",
    // day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true, // Altere para false se preferir formato de 24 horas
  });
}

export function formatDate(date: string): string {
  // Converte a string para o formato ISO que o JavaScript entende
  const [day, month, yearAndTime] = date.split("/");
  const [year, time] = yearAndTime.split(", ");

  // Ajusta para o formato correto: yyyy-mm-ddTHH:mm:ss
  const isoDateString = `${year}-${month}-${day}T${time}`;

  const newData = new Date(isoDateString); // Cria o objeto Date
  const now = new Date();
  const diffInMs = now.getTime() - newData.getTime();
  const diffInDays = diffInMs / (1000 * 3600 * 24);

  // Caso seja o mesmo dia, apenas mostrar a hora
  if (diffInDays < 1) {
    return newData.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // Caso seja ontem
  if (diffInDays < 2) {
    return "Ontem";
  }

  // Caso seja dentro da mesma semana
  if (diffInDays < 7) {
    return newData.toLocaleDateString("pt-BR", { weekday: "long" });
  }

  // Caso seja mais de uma semana atrás, mostrar a data no formato dd/mm/yyyy
  return newData.toLocaleDateString("pt-BR");
}

export function truncateText(text: string, maxLength: number) {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }
  return text;
}

export const formatDateMes = (date: Date): string => {
  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
    .format(date)
    .replace(",", "."); // Adiciona o ponto ao final do mês
};

export const meses = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

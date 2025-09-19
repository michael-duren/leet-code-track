import type {
  Problem,
  CreateProblemRequest,
  ProblemStats,
} from "../types/Problem";
import { useRequests } from "./base";

type ResponseMessage = {
  message: string;
};

export const useApi = () => {
  const requests = useRequests();

  return {
    Problems: {
      list: () => requests.get<Problem[]>("/problems"),
      listToday: () => requests.get<Problem[]>("/problems/today"),
      listProblemsToReview: () => requests.get<Problem[]>("/problems/reviews"),
      getById: (id: number) => requests.get<Problem>(`/problems/${id}`),
      getStats: () => requests.get<ProblemStats>("/problems/stats"),
      getByTopic: (topic?: string) =>
        requests.get<Problem[]>(
          `/problems/topics${topic ? `?topic=${encodeURIComponent(topic)}` : ""}`,
        ),
      search: (query?: string) =>
        requests.get<Problem[]>(
          `/problems/search${query ? `?q=${encodeURIComponent(query)}` : ""}`,
        ),
      create: (data: CreateProblemRequest) =>
        requests.post<CreateProblemRequest, { id: number }>("/problems", data),
      updateForFirstReview: (id: number) =>
        requests.put<{}, ResponseMessage>(`/problems/${id}/first-review`, {}),
      updateForSecondReview: (id: number) =>
        requests.put<{}, ResponseMessage>(`/problems/${id}/second-review`, {}),
      updateForMasterReview: (id: number) =>
        requests.put<{}, ResponseMessage>(`/problems/${id}/master-review`, {}),
      resetReviewTimer: (id: number) =>
        requests.put<{}, ResponseMessage>(`/problems/${id}/reset-timer`, {}),
      updateNotes: (id: number, notes: string) =>
        requests.put<{ notes: string }, Response>(`/problems/${id}/notes`, {
          notes,
        }),
      delete: (id: number) => requests.delete(`/problems/${id}`),
    },
  };
};

import { useMutation } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'
export const useMutationHook = (functionCallback) => {
    const mutation = useMutation({
        mutationFn: functionCallback,
    })
    return mutation
}
export const useQueryHook = (queryKey,functionCallback) => {
    const query = useQuery({
        queryKey: queryKey,
        queryFn: functionCallback,
    })
    return query
}
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clearCartApi } from "../Apis/cartApi";




export default function useMutationCart(fn) {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: fn,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] })
           if(fn===clearCartApi)
            queryClient.setQueriesData('cart',null)
        }
    })
}

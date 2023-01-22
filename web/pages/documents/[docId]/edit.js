import D1Form from "~/components/D1-Form/form"
import React from "react"
import { useRouter } from "next/router"

const EditDoc = () => {
    const router = useRouter()
    const { docId } = router.query

    return (
        <div>
            <D1Form editId={docId} />
        </div>
    )
}

export default EditDoc

import { formatPrice } from "@/actions/format-price"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Product } from "@/interfaces/products.interface"
import { Layout, LayoutList, SquarePen, Trash2 } from "lucide-react"
import Image from "next/image"
import { CreateUpdateItem } from "./create-update-item.form"
import { ConfirmDeletion } from "./confirm-deletion"
import { Skeleton } from "@/components/ui/skeleton"

interface TableViewProps {
    items: Product[];
    getItems: () => Promise<void>;
    deleteItem: (item: Product) => Promise<void>;
    isLoading: boolean;
}


export function TableView({ items, getItems, deleteItem, isLoading }: TableViewProps) {
    return (
        <>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Imagen</TableHead>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Precio</TableHead>
                        <TableHead>Unidades vendidas</TableHead>
                        <TableHead>Ganancias</TableHead>
                        <TableHead className="text-center w-[250px]">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {!isLoading && items && items.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell >
                                <Image
                                    width={1000}
                                    height={1000}
                                    src={item.image.url}
                                    alt={item.name}
                                    className="object-cover w-16 h-16"
                                />
                            </TableCell>
                            <TableCell className="font-semibold w-[350px]">{item.name}</TableCell>
                            <TableCell>{formatPrice(item.price)}</TableCell>
                            <TableCell>{item.soldUnits}</TableCell>
                            <TableCell>{formatPrice(item.soldUnits * item.price)}</TableCell>
                            <TableCell className="text-center">
                                <CreateUpdateItem getItems={getItems} itemToUpdate={item}>
                                    <Button>
                                        <SquarePen />
                                    </Button>
                                </CreateUpdateItem>

                                <ConfirmDeletion
                                    deleteItem={deleteItem}
                                    item={item}
                                >
                                    <Button className="ml-4" variant="destructive">
                                        <Trash2 />
                                    </Button>
                                </ConfirmDeletion>
                            </TableCell>
                        </TableRow>
                    ))}
                    {isLoading && [1, 1, 1, 1].map((e, i) => (
                        <TableRow key={i}>
                            <TableCell>
                                <Skeleton className="w-16 h-16 rounded-xl" />
                            </TableCell>
                            <TableCell>
                                <Skeleton className="w-full h-4" />
                            </TableCell>
                            <TableCell>
                                <Skeleton className="w-full h-4" />
                            </TableCell>
                            <TableCell>
                                <Skeleton className="w-full h-4" />
                            </TableCell>
                            <TableCell>
                                <Skeleton className="w-full h-4" />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {!isLoading && items.length === 0 &&
                <div className="text-gray-200 my-20">
                    <div className="flex justify-center">
                        <LayoutList className="w-[120px] h-[120px]"/>
                    </div>
                    <h2 className="text-center">No hay productos registrados</h2>
                </div>
            }

        </>


    )
}

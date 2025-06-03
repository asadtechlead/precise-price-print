
import { useState } from 'react';
import { Client, Product, Service, Invoice } from '@/types';

export const useFormStates = () => {
  // Form states
  const [isClientFormOpen, setIsClientFormOpen] = useState(false);
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [isServiceFormOpen, setIsServiceFormOpen] = useState(false);
  const [isInvoiceFormOpen, setIsInvoiceFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | undefined>();
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  const [editingService, setEditingService] = useState<Service | undefined>();
  const [editingInvoice, setEditingInvoice] = useState<Invoice | undefined>();
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | undefined>();

  const handleCreateClient = () => {
    setIsClientFormOpen(true);
    setEditingClient(undefined);
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setIsClientFormOpen(true);
  };

  const handleCreateProduct = () => {
    setIsProductFormOpen(true);
    setEditingProduct(undefined);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsProductFormOpen(true);
  };

  const handleCreateService = () => {
    setIsServiceFormOpen(true);
    setEditingService(undefined);
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setIsServiceFormOpen(true);
  };

  const handleCreateInvoice = () => {
    setIsInvoiceFormOpen(true);
    setEditingInvoice(undefined);
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setIsInvoiceFormOpen(true);
  };

  const handleViewInvoice = (invoice: Invoice) => {
    setViewingInvoice(invoice);
  };

  return {
    isClientFormOpen,
    isProductFormOpen,
    isServiceFormOpen,
    isInvoiceFormOpen,
    editingClient,
    editingProduct,
    editingService,
    editingInvoice,
    viewingInvoice,
    setIsClientFormOpen,
    setIsProductFormOpen,
    setIsServiceFormOpen,
    setIsInvoiceFormOpen,
    setEditingClient,
    setEditingProduct,
    setEditingService,
    setEditingInvoice,
    setViewingInvoice,
    handleCreateClient,
    handleEditClient,
    handleCreateProduct,
    handleEditProduct,
    handleCreateService,
    handleEditService,
    handleCreateInvoice,
    handleEditInvoice,
    handleViewInvoice,
  };
};

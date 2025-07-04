<?php

namespace App\Http\Controllers;

use App\Models\VisaDocument;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VisaDossierController extends Controller
{
    public function index()
    {
        $documents = auth()->user()->visaDocuments()
            ->orderBy('document_type')
            ->orderBy('created_at', 'desc')
            ->get()
            ->groupBy('document_type');

        $groupedDocuments = [
            'identity' => $documents->get('identity', collect())->values(),
            'financial' => $documents->get('financial', collect())->values(),
            'travel' => $documents->get('travel', collect())->values(),
        ];

        return Inertia::render('visa-dossier/index', [
            'documents' => $groupedDocuments,
        ]);
    }
}
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from 'src/app/service/http.service';
import { ProductService, Product } from 'src/app/service/product.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { DisposeBag } from '@ronas-it/dispose-bag';
import { OrderService } from 'src/app/service/order.service';

@Component({
  selector: 'app-manage-product',
  templateUrl: './manage-product.component.html',
  styleUrls: ['./manage-product.component.scss']
})
export class ManageProductComponent implements OnInit, OnDestroy {

  id:string;
  message = '  '
  file:File = null;
  env = environment;
  productForm:FormGroup;
  dispBag = new DisposeBag();

  constructor(
    private fBuilder:FormBuilder,
    private http:HttpService,
    private productService:ProductService,
    private route:ActivatedRoute,
    private orderService : OrderService
  ) { 
    this.productForm = this.fBuilder.group({
      name:['',[Validators.required,Validators.minLength(4)]],
      cost:['',[Validators.required]],
      quantity:['',[Validators.required]],
      company:['',[Validators.required]],
      description:['',[Validators.required]],
      seller:['',[Validators.required]],
      image:[''],
    })
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(
      (query)=>{
        if(query && query._id && this.productService.getProduct(query._id)){
          this.id = query._id;
          this.productForm.patchValue(this.productService.getProduct(query._id))
        }
      }
    )
  }

  ngOnDestroy(): void {
		this.dispBag.unsubscribe()
	}

  newProduct(){
    this.message = null;
    if(this.file){
      let formdata = new FormData()
      formdata.append('file',this.file,this.file.name)
      formdata.append('body',JSON.stringify(this.productForm.value))
      this.dispBag.add(
        this.http.postProduct(formdata).subscribe(
          (product:Product)=>{
            this.message="product uploaded to DB"
            this.orderService.clearCart()
            this.productService.putProduct(product)
          },
          err=>this.message = err.error.message
        )
      )
    } else {
      this.message = "Please select a Imgae !"
    }
  }

  updateProduct(){
    this.message = null
    this.dispBag.add(
      this.http.updateProduct(this.productForm.value,this.id).subscribe(
        (product:Product)=>{
          this.message="Product updated !"
          this.orderService.clearCart()
          this.productService.patchedProduct(product)
        },
        err=>this.message = err.error.message
      )
    )
  }

  submit(){
    if(!this.id){
      this.newProduct()
    } else {
      this.updateProduct()
    }
  }

  reset(){
    this.productForm.reset()
    this.file = undefined;
    this.id = undefined;
    this.message = '  ';
  }

  handleFile(event){
    this.file = <File>event.target.files[0]
  }

  get productFormControl() {
    return this.productForm.controls;
  }

}

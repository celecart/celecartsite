                    
                    {/* Beauty & Wellness Section */}
                  <p className="text-gray-700 mb-4">
                    {celebrity.id === 15 
                      ? `${celebrity.name} is known for her influential brand partnerships and business ventures. Her carefully curated portfolio includes beauty, fashion, and lifestyle brands that reflect her personal aesthetic and entrepreneurial vision.`
                      : `${celebrity.name} is known for using premium equipment tailored to their precise specifications. Each piece of gear is carefully selected to match their playing style and performance needs.`
                    }
                  </p>
                  
                  {!brandsLoading && celebrityBrands && Array.isArray(celebrityBrands) && (
                    <SignatureEquipment items={celebrityBrands} />
                  )}
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-4">{celebrity.id === 15 ? "Luxury & Lifestyle" : "Apparel & Accessories"}</h3>
                  <p className="text-gray-700 mb-4">
                    {celebrity.id === 15 
                      ? `${celebrity.name}'s influence extends beyond fashion into luxury lifestyle categories including fragrances, cosmetics, automobiles, and home decor. Her carefully curated selections reflect her sophisticated aesthetic and trendsetting vision.`
                      : `Beyond functional equipment, ${celebrity.name}'s personal style is complemented by carefully selected apparel and luxury accessories that enhance their professional image both on and off the court.`
                    }
                  </p>
                  
                  {!brandsLoading && celebrityBrands && Array.isArray(celebrityBrands) && (
                    <ApparelAccessories items={celebrityBrands} />
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="tournaments">
              <CelebrityTournaments celebrityId={celebrityId} />
            </TabsContent>
            
            <TabsContent value="specifications" className="mt-6">
              <div className="space-y-8">
                <h3 className="text-2xl font-bold">{celebrity.id === 15 ? "Product Details & Purchase Information" : "Technical Specifications"}</h3>
                <p className="text-gray-700">
                  {celebrity.id === 15 
                    ? `Explore the detailed features and purchase information for all of ${celebrity.name}'s signature products, from beauty and skincare to fragrances, clothing, accessories, and more.`
                    : `Professional tennis players require precisely tuned equipment to perform at their best. Below are the detailed specifications of ${celebrity.name}'s key equipment.`
                  }
                </p>
                
                {celebrity.id === 15 ? (
                  <div className="mt-8">
                    <SKKNProducts />
                  </div>
                ) : !brandsLoading && celebrityBrands && Array.isArray(celebrityBrands) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                    {celebrityBrands
                      .filter((item: CelebrityBrandWithDetails) => item.equipmentSpecs && Object.keys(item.equipmentSpecs).length > 0)
                      .map((item: CelebrityBrandWithDetails) => (
                        <div key={item.id} className="bg-gray-50 p-6 rounded-lg shadow-sm">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="font-bold text-xl">{item.description}</h4>
                              <p className="text-sm text-gray-500">{item.brand?.name}</p>
                            </div>
                            <div className="text-sm text-white bg-gold px-2 py-1 rounded">
                              {item.itemType}
                            </div>
                          </div>
                          
                          {item.equipmentSpecs && (
                            <div className="space-y-2">
                              {item.equipmentSpecs.weight && (
                                <div className="flex justify-between border-b border-gray-200 pb-1">
                                  <span className="text-gray-500">Weight</span>
                                  <span className="font-medium">{item.equipmentSpecs.weight}</span>
                                </div>
                              )}
                              {item.equipmentSpecs.size && (
                                <div className="flex justify-between border-b border-gray-200 pb-1">
                                  <span className="text-gray-500">Size</span>
                                  <span className="font-medium">{item.equipmentSpecs.size}</span>
                                </div>
                              )}
                              {item.equipmentSpecs.material && (
                                <div className="flex justify-between border-b border-gray-200 pb-1">
                                  <span className="text-gray-500">Material</span>
                                  <span className="font-medium">{item.equipmentSpecs.material}</span>
                                </div>
                              )}
                              {item.equipmentSpecs.stringTension && (
                                <div className="flex justify-between border-b border-gray-200 pb-1">
                                  <span className="text-gray-500">String Tension</span>
                                  <span className="font-medium">{item.equipmentSpecs.stringTension}</span>
                                </div>
                              )}
                              {item.equipmentSpecs.color && (
                                <div className="flex justify-between border-b border-gray-200 pb-1">
                                  <span className="text-gray-500">Color</span>
                                  <span className="font-medium">{item.equipmentSpecs.color}</span>
                                </div>
                              )}
                              {item.equipmentSpecs.releaseYear && (
                                <div className="flex justify-between border-b border-gray-200 pb-1">
                                  <span className="text-gray-500">Release Year</span>
                                  <span className="font-medium">{item.equipmentSpecs.releaseYear}</span>
                                </div>
                              )}
                              {item.equipmentSpecs.price && (
                                <div className="flex justify-between border-b border-gray-200 pb-1">
                                  <span className="text-gray-500">Price</span>
                                  <span className="font-medium text-gold">{item.equipmentSpecs.price}</span>
                                </div>
                              )}
                              {item.equipmentSpecs.stockStatus && (
                                <div className="flex justify-between border-b border-gray-200 pb-1">
                                  <span className="text-gray-500">Availability</span>
                                  <span className="font-medium">{item.equipmentSpecs.stockStatus}</span>
                                </div>
                              )}
                              {item.equipmentSpecs.serialNumber && (
                                <div className="flex justify-between border-b border-gray-200 pb-1">
                                  <span className="text-gray-500">Edition</span>
                                  <span className="font-medium">{item.equipmentSpecs.serialNumber}</span>
                                </div>
                              )}
                              {item.equipmentSpecs.purchaseLink && (
                                <div className="mt-4">
                                  <a 
                                    href={item.equipmentSpecs.purchaseLink} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="bg-gold text-dark py-2 px-4 rounded text-sm font-medium inline-flex items-center hover:bg-gold/90 transition-colors"
                                  >
                                    <span className="mr-2">Buy Now</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 7h10v10"/><path d="M7 17L17 7"/></svg>
                                  </a>
                                </div>
                              )}
                            </div>
                          )}
                          
                          {/* Occasion-based pricing */}
                          {item.occasionPricing && Object.keys(item.occasionPricing).length > 0 && (
                            <OccasionPricing item={item} />
                          )}
                          
                          {item.grandSlamAppearances && item.grandSlamAppearances.length > 0 && (
                            <div className="mt-4">
                              <h5 className="font-medium text-sm mb-1">Used at</h5>
                              <div className="flex flex-wrap gap-1">
                                {item.grandSlamAppearances.map((tournament: string, idx: number) => (
                                  <span key={idx} className="inline-block text-xs bg-gray-200 px-2 py-1 rounded">
                                    {tournament}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="share" className="mt-6">
              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gold/20 rounded-full">
                    <Share2 className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Share {celebrity.name}'s Style</h3>
                    <p className="text-gray-700">
                      Love {celebrity.name}'s style? Share their outfit inspirations with your friends and followers on social media.
                      Select an item below and use the social sharing buttons to spread fashion inspiration.
                    </p>
                  </div>
                </div>
                
                {celebrity && (
                  <OutfitShareGrid 
                    celebrityId={celebrity.id} 
                    className="mt-8"
                  />
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="media" className="mt-6">
              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gold/20 rounded-full">
                    <Camera className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Upload Personal Media</h3>
                    <p className="text-gray-700">
                      As {celebrity.name}, share your personal photos and videos with your fans. 
                      These will be featured on your profile and can be used to showcase your life outside of sport.
                    </p>
                  </div>
                </div>
                
                {/* Celebrity Styling Details */}
                {celebrity.stylingDetails && (
                  <div className="mt-8">
                    <h3 className="text-xl font-playfair font-bold mb-4 text-gold">Styling Information</h3>
                    <StylingDetails 
                      looks={celebrity.stylingDetails as any[]} 
                      className="mb-8"
                    />
                  </div>
                )}
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-amber-100 mt-8">
                  <MediaUpload />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="videos" className="mt-6">
              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gold/20 rounded-full">
                    <Video className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">
                      {celebrity.id === 15 
                        ? `${celebrity.name}'s Style Episode Series` 
                        : `${celebrity.name}'s Tournament Videos`}
                    </h3>
                    <p className="text-gray-700">
                      {celebrity.id === 15 
                        ? `Explore our exclusive 6-part episode series on ${celebrity.name}'s fashion evolution, business ventures, and style influence. Each episode covers a different aspect of her journey to becoming a fashion icon.` 
                        : `Watch ${celebrity.name} in action at various tournaments and events. These videos showcase their performance, style, and equipment in real competitive scenarios.`}
                    </p>
                  </div>
                </div>
                
                <div className="mt-8">
                  <TournamentVideoTab celebrity={celebrity} />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="events" className="mt-6">
              <LiveEvents celebrity={celebrity} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* AI-Powered Features Section */}
      <div className="py-16 bg-midgray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-2">
              <Sparkles className="h-5 w-5 text-gold mr-2" />
              <span className="text-gold uppercase tracking-widest text-sm font-semibold">AI-Powered Features</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold font-playfair text-light mb-4">
              Explore {celebrity.name}'s Style with AI
            </h2>
            <p className="text-light/70 max-w-2xl mx-auto">
              Leverage our cutting-edge AI to analyze {celebrity.name}'s fashion choices, get personalized recommendations,
              and discover similar styles across sports celebrities.
            </p>
          </div>
          
          {/* AI Features Tabs */}
          <AIFeaturesTabs celebrity={celebrity} />
        </div>
      </div>

      <Newsletter />
      <Footer />
      
      {showBrandModal && selectedBrand && (
        <BrandModal brand={selectedBrand} onClose={handleCloseBrandModal} />
      )}
    </div>
  );
}
